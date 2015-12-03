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
    self.save_yml

    old_package, old_split_package = repack.info_json[:package], repack.info_json[:package].gsub('.', '/')
    new_package, new_split_package = repack.repack_json[:package], repack.repack_json[:package].gsub('.', '/')


    puts "relace pacakge str start"

    Directory.recursive_files(build_path).each do |dir|
      if %w(smali xml java).include?(dir.name.split(".").last)
        self.replace(dir.path, old_package, new_package)
        self.replace(dir.path, old_split_package, new_split_package)
      end
    end

    puts "relace pacakge str end"
  end

  #保存yml配置文件
  def save_yml
    File.open("#{build_path}/apktool.yml", 'wb') do |f|
      f.write(yml.to_yaml)
    end
  end

  #替换文件内容
  def replace(file_path, old_str, new_str)
    content = File.read(file_path)
    begin
      content = content.gsub(old_str, new_str)
    rescue
    end

    File.open(file_path, 'wb') do |f|
      f.write(content)
    end
  end

end