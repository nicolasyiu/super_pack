class SuperPacksController < ApplicationController

  def index
    @projects = DirectoriesController::PROJECTS
  end

  def create
    project = DirectoriesController::PROJECTS[params[:project]]
    lock_file_path = "#{DirectoriesController::PROJECTS_ROOT}/#{project[:path]}/super_pack.lock"

    return render json: {msg: 'error', error: "#{project[:label]}打包被锁定，请稍等！"}, status: 400 if File.exist?(lock_file_path)

    #FIXME:创建者id修改
    lock_content = {
        flavor: params[:flavor],
        creator_id: current_user[:user_id]
    }
    code = File.open(lock_file_path, 'w+') do |file|
      file.write(lock_content.to_json)
    end
    if code
      render json: {msg: 'ok'}
    else
      render json: {msg: 'error'}, status: 400
    end
  end

  #获取某个应用下所有的flavor
  def flavors
    project = DirectoriesController::PROJECTS[params[:project]]
    @flavors = Directory.children("#{DirectoriesController::PROJECTS_ROOT}/#{project[:path]}").select { |f| !f.file? }
    # respond_to do |format|
    #   format.json { render json: @flavors }
    #   format.html
    # end
    render layout: nil
  end
end
