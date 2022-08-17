#!/bin/bash

# 强调当前执行的用户权限
npm install --unsafe-perm=true

startTime_s=`date +%s`

# npm源切换
npm config set registry https://registry.npm.taobao.org
npm install
npm run build

if [ $? -eq 1 ]
then 
  echo "打包失败"
  exit 1
fi

# 复制打包文件
cp -rf /var/lib/jenkins/workspace/blogWeb/blogWeb/* /root/blogWeb

# 热加载nginx服务
systemctl restart nginx

# 统计时间
endTime_s=`date +%s`
durationTime=$[ $endTime_s - $startTime_s ]
echo -e "\033[1;32m 部署用时：${durationTime}s \033[0m"