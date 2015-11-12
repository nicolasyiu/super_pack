module DirectoriesHelper

  #目录分割线
  def path_split_links(path)
    array = path.to_s.split("/")
    tmp_array = []
    array.inject([]) { |link, name|
      tmp_array << name
      link << {name: name, path: tmp_array.join("/")}
      link
    }.inject([]) { |html_array, link|
      html_array << (link[:path]==path ? link[:name] : "<a href='/directories?#{dir_link_params(link[:path])}'>#{link[:name]}</a>"); html_array
    }.join('&nbsp;/&nbsp;').html_safe
  end


  def dir_link_params(extra_path)
    _params = ["extra_path=#{extra_path}"]
    (_params << "project=#{params[:project]}") if params[:project].present? && !params[:root_path].present?
    (_params << "root_path=#{params[:root_path]}") if params[:root_path].present?
    _params.join('&')
  end

  #文件图标样式
  def file_icon_style(file_path)
    suffix = file_path.split(".").last
    return "glyphicon-picture" if %w(png jpg gif).include?(suffix)
    "glyphicon-list-alt"
  end

end
