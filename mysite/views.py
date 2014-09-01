from django.http import HttpResponse
from django.shortcuts import render_to_response
import json
import pymongo
import hashlib
import base64


def md5encode(psd):
    md5=hashlib.md5()
    md5.update(psd)
    return base64.encodestring(md5.digest())

def index(request):
    return HttpResponse("Hello world ! ")
def test(request):
    return render_to_response("index.html")
def getUser(req,userid):
    con=pymongo.Connection('127.0.0.1')
    db=con.UserManagement
    tb=db.Users
    user={}
    user['userId']=userid
    user=tb.find_one(user)
    user.pop('_id')
    return HttpResponse(json.dumps(user))
def getUsers(req):
    con=pymongo.Connection('127.0.0.1')
    db=con.UserManagement
    tb=db.Users
    userlist=[]
    for user in tb.find():
        user.pop('_id')
        userlist.append(user)
    
    return HttpResponse(json.dumps(userlist))
def users(req):
    con=pymongo.Connection('127.0.0.1')
    db=con.UserManagement
    tb=db.Users
    user={}
    user['userId']=req.POST['userId']
    if req.POST.get('isDelete'):
        tb.remove(user)
    else:
        user['password']=md5encode(req.POST['password'])
        user['role']=req.POST['role']
        user['firstName']=req.POST['firstName']
        user['lastName']=req.POST['lastName']
        user['phoneNumber']=req.POST['phoneNumber']
        if req.POST.get('isNew'):
            tb.insert(user)
        else:
            user.pop('password')
            tb.update({'userId':user['userId']},{"$set":user})
    
    result={'message':'ok'}
    return HttpResponse(json.dumps(result))

def login(req):
    if req.POST:
        con=pymongo.Connection('127.0.0.1')
        db=con.UserManagement
        tb=db.Users
        user={}
        user['userId']=req.POST['userId']
        user['password']=md5encode(req.POST['password'])
        t=tb.find(user).count()
        if t>0:
            m=tb.find_one(user)
            m.pop('_id')
            ret={'message':'ok','model':m}
            req.session['user']=m
            return HttpResponse(json.dumps(ret))
        else:
            return HttpResponse('{"message":"User Name or Password is error!"}')
        
    else:
        return HttpResponse('{"message":"You should user POST method!"}')
def getCurrentUser(req):
    if req.session.get('user'):
        ret={'message':'ok','model':req.session.get('user')}
        return HttpResponse(json.dumps(ret))
    else:
        ret={'message':False}
        return HttpResponse(json.dumps(ret))
def logout(req):
    req.session.pop('user')
    ret={'message':True}
    return HttpResponse(json.dumps(ret))
    