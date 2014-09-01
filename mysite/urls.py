from django.conf.urls import include, url
from django.contrib import admin
from mysite import views
from mysite import settings

urlpatterns = [
    # Examples:
    # url(r'^$', 'mysite.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    #url(r'^$', views.index, name='index'),
	url(r'^$', 'django.contrib.staticfiles.views.serve', kwargs={'path': 'index.html', 'document_root': settings.STATIC_ROOT}),
	url(r'^assets/(?P<path>.*)$','django.views.static.serve',{'document_root':settings.STATIC_URL, 'show_indexes': True}),
	url(r'^users/(?P<userid>[^/]+)/$',views.getUser),
	url(r'^test$', views.test),
	url(r'^login$', views.login),
    url(r'^getUsers$', views.getUsers),
    url(r'^users', views.users),
    url(r'^currentuser',views.getCurrentUser),
    url(r'^logout',views.logout)
]
