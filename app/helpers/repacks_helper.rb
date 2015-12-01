module RepacksHelper

  def repack_status_html(status)
    return "<span class='mi-badge warning'>打包中</span>".html_safe if status=='ing'
    return "<span class='mi-badge default'>未开始</span>".html_safe if status=='none'
    return "<span class='mi-badge danger'>打包出错</span>".html_safe if status=='error'
    "<span class='mi-badge success'>打包成功</span>".html_safe
  end
end
