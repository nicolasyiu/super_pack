class SuperPack

  #锁定文件是否存在
  def self.locking?(project_name)
    File.exist?(lock_file_path(project_name))
  end

  #锁定项目
  def self.lock(project_name)
    File.open(lock_file_path(project_name), 'w+')
  end

  #解锁项目
  def self.unlock(project_name)
    File.delete(lock_file_path(project_name))
  end

  #打包所用时长
  def self.run_sec(project_name)
    return Time.now.to_i-File.ctime(run_file_path(project_name)).to_i if running?(project_name)
    0
  end

  #正在打包的人
  def self.runner(project_name)
    PUser.where(user_id: lock_json(project_name)['creator_id']).take
  end

  #是否正在运行打包
  def self.running?(project_name)
    File.exist?(run_file_path(project_name))
  end

  #开始运行
  def self.run(project_name)
    File.open(run_file_path(project_name), 'w+')
  end

  #结束运行
  def self.stop(project_name)
    File.delete(run_file_path(project_name))
  end

  #锁定文件的
  def self.lock_json(project_name)
    require 'json'
    JSON.parse(File.read(lock_file_path(project_name)))
  end

  #锁定文件的路径
  def self.lock_file_path(project_name)
    "#{DirectoriesController::PROJECTS_ROOT}/#{DirectoriesController::PROJECTS[project_name][:path]}/super_pack.lock"
  end

  #运行文件的路径
  def self.run_file_path(project_name)
    "#{DirectoriesController::PROJECTS_ROOT}/#{DirectoriesController::PROJECTS[project_name][:path]}/super_pack_running.lock"
  end

end