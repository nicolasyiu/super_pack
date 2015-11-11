Rails.application.routes.draw do


  resources :super_packs
  root 'super_packs#index'

  resources :directories do
    collection do
      put 'rename', to: :rename
      post 'upload', to: :upload
    end
  end
end
