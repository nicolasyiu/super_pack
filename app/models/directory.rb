class Directory
  attr_accessor :name
  attr_accessor :path

  def initialize(file_path)
    @path = file_path
  end

  #文件或者目录名称
  def self.children(file_path)
    Directory.new(file_path).children
  end

  def children
    if self.file?
      []
    else
      Dir.foreach(path).inject([]) { |children, item|
        directory = Directory.new("#{path}/#{item}")
        (children << directory) unless %w(. .. .git .gradle .idea .DS_Store .classpath .settings .project .gitignore).include?(directory.name); children
      }
    end
  end


  def file?
    File.file?(path)
  end

  #文件或者目录的名称
  def name
    _path = path.to_s
    if _path.end_with?("/")
      @name = path.split("/")[-1]
    else
      @name = path.split("/").last
    end
  end

end