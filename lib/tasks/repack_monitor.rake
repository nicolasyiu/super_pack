namespace :repack_monitor do

  desc "Start to repack a apk file"
  task :start, [] => :environment do |t, args|
    now = Time.now.to_i
    while Time.now.to_i-now <55 do
      monitor
      sleep(1)
    end
  end
  private
  #开始监控
  def monitor
    repack_dir = Directory.children("#{Rails.public_path}/repack").select { |item|
      File.read("#{item.path}/.status")=='none'
    }[0]
    repack(repack_dir.name) if repack_dir
  end

  #开始打包
  #重新打包编译一个文件
  #1.解压反编译apk
  #2.修改资源文件等信息
  #3.包名修改
  #4.字符串替换、meta信息等替换
  #5.打包apk
  #6.起名重新输出文件信息
  def repack(repack_id)
    repack = Repack.find(repack_id)
    repack.status = 'ing'

    #拷贝文件
    #build文件夹只进行配置，不在这里打包
    #打包时用repack目录
    system "rm -r #{File.dirname(repack.file_path).to_s.gsub(' ', '\ ')}/repack"
    system "cp -r #{File.dirname(repack.file_path).to_s.gsub(' ', '\ ')}/build #{File.dirname(repack.file_path).to_s.gsub(' ', '\ ')}/repack"
    system "rm -r #{File.dirname(repack.file_path).to_s.gsub(' ', '\ ')}/repack/dist"
    system "mkdir #{File.dirname(repack.file_path).to_s.gsub(' ', '\ ')}/build/dist"

    #apktool.yml
    apktool = ApkTool.new(nil, "#{File.dirname(repack.file_path)}/repack")
    apktool.repack(repack)

    #打包、拷贝apk文件到配置目录、删除打包目录
    rebuild_command = "apktool b -f #{File.dirname(repack.file_path).to_s.gsub(' ', '\ ')}/repack"
    puts `java -version`
    puts rebuild_command
    ret = system(rebuild_command)
    system "cp #{File.dirname(repack.file_path).to_s.gsub(' ', '\ ')}/repack/dist/*.apk #{File.dirname(repack.file_path).to_s.gsub(' ', '\ ')}/build/dist/"
    system "rm -r #{File.dirname(repack.file_path).to_s.gsub(' ', '\ ')}/repack"

    repack.status = ret ? 'success' : 'error'
  end

end