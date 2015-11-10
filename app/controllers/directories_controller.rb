class DirectoriesController < ApplicationController
  def index
    params[:root_path] ||="/Users/saxer/Develope/Bitbucket"
    params[:extra_path] ||= "mi.android2/flavors"
    dir_path = "#{params[:root_path]}/#{params[:extra_path]}"
    @directories = Directory.children(dir_path)
  end

  def show
    file_path = "#{params[:root_path]}/#{params[:extra_path]}"
    @suffix = file_path.split(".").last
    @content = File.read(file_path)
  end

  def new
  end

  def edit
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
    num = File.delete(params[:path])
    if num>0
      render json: {msg: 'ok'}
    else
      render json: {msg: 'error'}, status: 400
    end
  end
end
