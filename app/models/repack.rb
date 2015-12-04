require 'rexml/document'
class Repack
  include REXML
  attr_accessor :file_path
  attr_accessor :id

  attr_accessor :info_json #应用详细信息
  attr_reader :repack_json #打包配置信息
  attr_accessor :size

  attr_reader :apk_sign #原始apk的签名信息

  attr_accessor :status #状态

  def initialize(file_path)
    puts file_path
    self.file_path = file_path
    @size = File.size(file_path)

    self.id = File.dirname(file_path).split("/").last

    #反编译
    init_apk_decode

    #初始化应用基本信息
    self.info_json ||= {}
    self.info_json[:META]||={}
    self.info_json[:STRING]||={}
    aapt_load_info

    #生成打包配置信息
    create_config_json
  end

  def self.find(id)
    file_path = Directory.children("#{Rails.public_path}/repack/#{id}").select { |dir| dir.name.to_s.end_with?(".apk") }[0].path
    Repack.new(file_path)
  end

  #初始化apk反编译资源文件
  def init_apk_decode
    decode_path = "#{File.dirname(file_path)}/decode"
    build_path = "#{File.dirname(file_path)}/build"
    `apktool d -f #{file_path.gsub(' ', '\ ')} -o #{decode_path.gsub(' ', '\ ')}` unless Dir.exist?(decode_path) #原始包
    `apktool d -f #{file_path.gsub(' ', '\ ')} -o #{build_path.gsub(' ', '\ ')}` unless Dir.exist?(build_path) #打包用的包
  end

  #原始包的一个用签名
  def apk_sign

    @apk_sign ||= `echo #{File.dirname(file_path).gsub(' ', '\ ')}/decode/original/META-INF/*.RSA`.split("\n").inject('') do |str, rsa|
      command ="keytool -printcert -file #{rsa.gsub(" ", '\ ')}"
      str<< `#{command}`
    end

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
    #配置文件
    config_path = "#{Rails.public_path}/repack/#{id}/config.json"
    File.open(config_path, 'wb') do |f|
      f.write(JSON.pretty_generate(self.info_json))
    end unless File.exist?(config_path)

    #状态文件
    status_path = "#{Rails.public_path}/repack/#{id}/.status"
    File.open(status_path, 'wb') do |f|
      f.write('none')
    end unless File.exist?(status_path)
  end

  #读取打包配置文件
  def repack_json
    @repack_json ||= JSON.parse(File.read("#{Rails.public_path}/repack/#{id}/config.json")).symbolize_keys
  end


  def status
    @status ||= File.read("#{Rails.public_path}/repack/#{id}/.status")
  end

  def status=(st)
    File.open("#{Rails.public_path}/repack/#{id}/.status", 'wb') do |f|
      f.write(st)
    end
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
    aapt_command = "aapt d badging #{file_path.gsub(' ', '\ ')}"
    puts "aapt_command\t#{aapt_command}"
    puts `#{aapt_command}`
    `#{aapt_command}`.to_s.split("\n").each do |info|
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
    doc = REXML::Document.new(File.read("#{File.dirname(file_path)}/decode/AndroidManifest.xml"))
    doc.root.elements['application'].get_elements('meta-data').each { |meta|
      self.info_json[:META][meta.attributes['android:name']]=meta.attributes['android:value']
    }

    info_json
  end
end