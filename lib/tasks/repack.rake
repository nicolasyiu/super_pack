namespace :repack do

  #反编译一个apk到指定的目录
  desc "decode a app into specified path"
  task :decode, [:app_path] => :environment do |t, args|
    decode_path = "#{File.dirname(args.app_path)}/decode".gsub(' ', '\ ')
    decode_command = "apktool d -f #{args.app_path} -o #{decode_path}"
    puts decode_command
    system decode_command
  end

  #重新打包编译一个文件
  #1.解压反编译apk
  #2.修改资源文件等信息
  #3.包名修改
  #4.字符串替换、meta信息等替换
  #5.打包apk
  #6.起名重新输出文件信息
  desc "Start to repack a apk file"
  task :start, [] => :environment do |t, args|

  end

end