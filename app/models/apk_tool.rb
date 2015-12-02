class ApkTool
  attr_accessor :build_path
  attr_reader :yml

  def initialize(apkpath=nil, build_path=nil)

    self.build_path = build_path
  end

  #打包
  def build_path=(build_path)
    @build_path = build_path
    @yml = YAML::load_file("#{build_path}/apktool.yml").stringify_keys if build_path
    @build_path
  end

  #根据repack的配置信息，修改本身的配置文件
  def repack(repack)
    yml['apkFileName'] = "#{repack.repack_json[:appName]}_#{repack.repack_json[:package]}_v#{repack.repack_json[:versionName]}_#{repack.repack_json[:versionCode]}.apk"
    yml['versionInfo']['versionName'] = repack.repack_json[:versionName]
    yml['versionInfo']['versionCode'] = repack.repack_json[:versionCode]
    yml['packageInfo']['orig_package'] = repack.info_json[:package]
    yml['packageInfo']['cur_package'] = repack.repack_json[:package]
    #TODO: package修改
    self.save_yml

    Directory.recursive_files(build_path).each do |dir|
      puts dir.name
      #TODO:package修改
    end
    # File.walk(self.decoded_file_path):
  end

  #保存yml配置文件
  def save_yml
    File.open("#{build_path}/apktool.yml", 'wb') do |f|
      f.write(yml.to_yaml)
    end
  end
end