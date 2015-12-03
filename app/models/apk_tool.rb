require 'rexml/document'
class ApkTool
  include REXML
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


    #package str
    Directory.recursive_files(build_path).each do |dir|
      if %w(smali xml java).include?(dir.name.split(".").last)
        self.replace(dir.path, old_package, new_package)
        self.replace(dir.path, old_split_package, new_split_package)
      end
    end

    #AndroidManifest.xml
    ###app_name
    doc = REXML::Document.new(File.read("#{build_path}/AndroidManifest.xml"))
    label_attribute = doc.root.elements['application'].attributes['android:label']
    if label_attribute
      if label_attribute.start_with?('@string')
        string_doc = REXML::Document.new(File.read("#{build_path}/res/values/strings.xml"))
        string_doc.root.elements["string[@name='#{label_attribute.gsub('@string/', '')}']"].text = repack.repack_json[:appName]
        File.open("#{build_path}/res/values/strings.xml", 'wb') do |f|
          string_doc.write(f, 2)
        end
      else
        doc.root.elements['application'].attributes['android:label'] = repack.repack_json[:appName]
      end
    end
    ###TODO:mainActivityName

    ###meta
    repack.repack_json[:META].each do |key, v|
      doc.root.elements['application'].elements["meta-data[@android:name='#{key.to_s}']"].attributes['android:value'] =v.to_s
      #FIXME:修复@string/UMENG_KEY这样的问题
    end

    File.open("#{build_path}/AndroidManifest.xml", 'w') do |f|
      doc.write(f, 2)
    end
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