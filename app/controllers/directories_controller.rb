class DirectoriesController < ApplicationController
  PROJECTS_ROOT = '/Users/saxer/Develope/Bitbucket'
  PROJECTS = {
      'ad_market' => {
          name: 'ad_market',
          label: '升级提示APP',
          path: 'ad_market/app/flavors'
      },
      'mi.android' => {
          name: 'mi.android',
          label: '觅恋APP',
          path: 'mi.android2/flavors'
      },
      'glass' => {
          name: 'glass',
          label: '碎屏APP',
          path: 'glass/code/trunk/flavors'
      }
  }

  def index
    @projects = PROJECTS
    params[:project] ||= 'ad_market'
    @project = @projects[params[:project]]
    @root_path = params[:root_path] ||"#{PROJECTS_ROOT}/#{@project[:path]}"
    dir_path = "#{@root_path}/#{params[:extra_path]}"
    @directories = Directory.children(dir_path)
  end

  def show
    @projects = PROJECTS
    @project = @projects[params[:project]]
    file_path = "#{params[:root_path]}/#{params[:extra_path]}"
    @suffix = file_path.split(".").last
    @content = File.read(file_path)
  end

  def new
  end

  def edit
  end

  def create
    code = params[:filetype]=='file' ? File.open(params[:path], 'w+') : Dir.mkdir(params[:path], 0700)
    if (params[:filetype]=='file' && code) || (params[:filetype]=='dir' && code==0)
      render json: {msg: 'ok'}
    else
      render json: {msg: 'error'}, status: 400
    end
  end

  def upload
    file = params[:file]
    @filename = file.original_filename
    File.open("#{params[:dir_path]}/#{@filename}", 'wb') do |f|
      f.write(file.read)
    end
    render json: {msg: 'ok', filename: @filename}
  end

  def update
    file_path = "#{params[:root_path]}/#{params[:extra_path]}"
    File.open(file_path, 'w+') do |file|
      file.write(params[:content])
    end
    render json: {msg: 'ok'}
  end

  def rename
    code = File.rename(params[:old_path], params[:new_path])
    if code==0
      render json: {msg: 'ok'}
    else
      render json: {msg: 'error'}, status: 400
    end
  end

  def destroy
    is_file = File.file?(params[:path])
    error = ''

    begin
      num = File.delete(params[:path]) if is_file
      code = Dir.delete(params[:path]) unless is_file
    rescue Exception => e
      error = e.message
    end

    if (is_file && num>0) || (!is_file && code==0)
      render json: {msg: 'ok'}
    else
      render json: {msg: 'error', error: error}, status: 400
    end
  end

  protected
  def uploadfile(file, dir_path)
    if !file.original_filename.empty?
      @filename = file.original_filename
      File.open("#{dir_path}/#{@filename}", "wb") do |f|
        f.write(file.read)
      end
      return @filename
    end
  end
end
