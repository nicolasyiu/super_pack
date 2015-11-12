class PUser < ActiveRecord::Base
  self.table_name = 'p_user'

  def avatar_url
    "http://image.yepcolor.com/v2/public-avatars/%003d.png"%user_id
  end

  def role_cn
    {
        root: '管理员',
        promotioner: '推广经理',
        dispatcher: '调度经理',
        publisher: '发布经理',
        packager: '封包工程师',
    }[self.role.to_sym]
  end
end