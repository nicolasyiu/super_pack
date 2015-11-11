class SuperPacksController < ApplicationController
  def index
    @projects = DirectoriesController::PROJECTS
  end

  #获取某个应用下所有的flavor
  def flavors
    project = DirectoriesController::PROJECTS[params[:project]]
    @flavors = Directory.children("#{DirectoriesController::PROJECTS_ROOT}/#{project[:path]}")
    # respond_to do |format|
    #   format.json { render json: @flavors }
    #   format.html
    # end
    render layout: nil
  end
end
