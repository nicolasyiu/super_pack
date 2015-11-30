class RepacksController < ApplicationController

  def index
    @repacks = Directory.children("#{Rails.public_path}/repack").sort! { |a, b| b.name <=> a.name }.inject([]) { |memo, dir|
      memo<< Repack.new(`echo #{Rails.public_path.to_s.gsub(' ', '\ ')}/repack/#{dir.name}/*.apk`.gsub("\n", ''))
    }
  end

  def show
    file_path = `echo #{Rails.public_path.to_s.gsub(' ', '\ ')}/repack/#{params[:id]}/*.apk`.gsub("\n", '')
    @repack = Repack.new(file_path)
  end

  def create

  end

  def upload
    file = params[:file]
    @filename = file.original_filename

    #创建文件目录
    id = Time.now.strftime('%Y%m%d%H%M%S')
    upload_path = "#{Rails.public_path}/repack/#{id}"
    Dir.mkdir(upload_path, 0700) unless Dir.exist?(upload_path)

    #写文件
    File.open("#{upload_path}/#{@filename}", 'wb') do |f|
      f.write(file.read)
    end

    #反编译
    decode_path = "#{upload_path}/decode".gsub(' ', '\ ')
    file_path = "#{upload_path}/#{@filename}".gsub(' ', '\ ')
    `apktool d -f #{file_path} -o #{decode_path}`

    #生成应用信息文件和应用打包配置文件
    @repack = Repack.new("#{upload_path}/#{@filename}")

    render json: {msg: 'ok', filename: @filename, id: id}
  end
end
