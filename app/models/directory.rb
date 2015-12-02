class Directory
  attr_accessor :name
  attr_accessor :path
  attr_accessor :size

  def initialize(file_path)
    @path = file_path
    @name = path.to_s.end_with?("/") ? path.to_s.split("/")[-1] : path.to_s.split("/").last
    @size = File.size(file_path)
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

  #递归获取某目录下的所有文件
  def self.recursive_files(dir_path)
    files = []
    Directory.children(dir_path).each { |d|
      files << d if d.file?
      files += Directory.recursive_files(d.path) unless d.file?
    }
    files
  end

  def file?
    File.file?(path)
  end

end