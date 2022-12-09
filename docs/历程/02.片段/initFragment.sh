countNumer=`ls -l | grep "^-" | wc -l`
fileDateText=`date +%Y年%m月%d日`
fileName=`echo $countNumer`"."$fileDateText".md" 
touch $fileName
echo "\r\n---\r\n" > "./"$fileName
