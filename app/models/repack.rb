class Repack
  attr_accessor :file_path
  attr_accessor :id

  attr_accessor :info_json #应用详细信息
  attr_accessor :repack_json #打包信息

  def initialize(file_path)
    self.file_path = file_path

    self.id = File.dirname(file_path).split("/").last

    #初始化应用基本信息
    self.info_json ||= {}
    self.info_json[:meta]||={}
    aapt_load_info

  end

  #生成打包配置文件
  def create_repack_json

  end

  #图标的url地址
  def ic_launcher_path
    launcher_path = "/repack/#{self.id}/decode/#{self.info_json[:icLauncher]}"

    return launcher_path.gsub("dpi/", "dpi-v4/") unless Dir.exist?("#{Rails.public_path}/#{launcher_path}")

    launcher_path
  end

  private
  def aapt_load_info

    #appt basic
    for info in `aapt d badging #{file_path.gsub(' ', '\ ')}`.split("\n")
      if info.to_s.start_with?('package:')
        key_dict = info.gsub('pacakge:', '').gsub("'", '').split(' ').inject({}) { |memo, item|
          memo[item.split('=')[0].to_sym]=item.split('=')[1]; memo
        }
        self.info_json[:package] = key_dict[:name]
        self.info_json[:versionCode] = key_dict[:versionCode]
        self.info_json[:versionName] = key_dict[:versionName]
      end
      if info.to_s.start_with?('application:')
        key_dict = info.gsub('application:', '').gsub("'", '').split(' ').inject({}) { |memo, item|
          memo[item.split('=')[0].to_sym]=item.split('=')[1]; memo
        }
        self.info_json[:appName] = key_dict[:label]
        self.info_json[:icLauncher] = key_dict[:icon]
      end
    end

    #aapt metas
    xml_tree = `aapt dump xmltree #{file_path.gsub(' ', '\ ')} AndroidManifest.xml`.split("\n")
    xml_tree.each_with_index do |info, i|
      if info.include?('E: meta-data')
        name = xml_tree[i+1].gsub("\n", '').split("=\"")[1].split("\"")[0]
        value = ''
        if xml_tree[i+2].include?('type 0x')
          value=xml_tree[i+2].gsub("\n", '').split('type 0x')[1].split(')')[1]
        elsif xml_tree[i+2].include?('android:resource')
          value=xml_tree[i+2].gsub("\n", '').split(')=')[1]
        else
          value=xml_tree[i+2].gsub("\n", '').split("=\"")[1].split("\"")[0]
        end
        self.info_json[:meta][name.to_sym]=value
      end
    end

    info_json
  end
end