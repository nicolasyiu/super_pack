class Repack
  attr_accessor :file_path
  attr_accessor :id

  attr_accessor :info_json #应用详细信息
  attr_accessor :repack_json #打包信息
  attr_accessor :size

  def initialize(file_path)
    self.file_path = file_path
    @size = File.size(file_path)

    self.id = File.dirname(file_path).split("/").last

    #反编译
    init_apk_decode

    #初始化应用基本信息
    self.info_json ||= {}
    self.info_json[:META]||={}
    aapt_load_info

    #生成打包配置信息
    create_config_json
  end


  #初始化apk反编译资源文件
  def init_apk_decode
    decode_path = "#{File.dirname(file_path)}/decode"
    build_path = "#{File.dirname(file_path)}/build"
    `apktool d -f #{file_path.gsub(' ', '\ ')} -o #{decode_path.gsub(' ', '\ ')}` unless Dir.exist?(decode_path)
    `apktool d -f #{file_path.gsub(' ', '\ ')} -o #{build_path.gsub(' ', '\ ')}` unless Dir.exist?(build_path)
  end

  #生成打包配置文件
  # {
  #     "versionCode": 651,
  #     "versionName": "2.4.6",
  #     "APP_CHANNELS": {
  #     "初爱": [
  #     "QQ腾讯应用宝"
  # ]
  # },
  #     "META": {
  #     "aihuo_api_key": "2d4c5104",
  #     "aihuo_secret_key": "8604846a2d75a61e9ff1922cbc87937e",
  #     "UMENG_APPKEY": "55e6b29ee0f55a057e0032f8",
  #     "PUSH_APPID": "oCD8YxLfGF7EMjdZdbI1t7",
  #     "PUSH_APPKEY": "7ZplEieSk38YgD4q5Xskj9",
  #     "PUSH_APPSECRET": "TcHCybyBmv8W3GdsZDiE07"
  # },
  #     "STRING": {
  # },
  #     "PERMISSION": {
  # },
  #     "SIGN": "bluestorm"
  # }
  def create_config_json
    config_path = "#{Rails.public_path}/repack/#{id}/config.json"
    File.open(config_path, 'wb') do |f|
      f.write(JSON.pretty_generate(self.info_json))
    end unless File.exist?(config_path)
  end

  #图标的url地址
  def ic_launcher_path
    launcher_path = "/repack/#{self.id}/decode/#{self.info_json[:icLauncher]}"

    return launcher_path.gsub("dpi/", "dpi-v4/") unless Dir.exist?("#{Rails.public_path}/#{launcher_path}")

    launcher_path
  end

  private
  def aapt_load_info

    if self.info_json[:package]
      return self.info_json
    end

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
        self.info_json[:META][name.to_sym]=value
      end
    end

    info_json
  end
end