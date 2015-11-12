module ApplicationHelper

  #当前登录用户
  def current_user
    user = PUser.where(user_id: session[:user_id]).take
    unless user
      session[:user_id]=nil
      return redirect_to root_path
    end
    user
  end


  #显示多个空格
  def h_html_empty(html, number)
    (html+number.times.inject('') { |acc, i| acc+='&nbsp;' }).html_safe
  end
end
