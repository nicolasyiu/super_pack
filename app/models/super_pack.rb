class SuperPack

  #锁定文件是否存在
  def self.exist?(project_name)
    File.exist?("#{DirectoriesController::PROJECTS_ROOT}/#{DirectoriesController::PROJECTS[project_name][:path]}/super_pack.lock")
  end
end