
s = ["county","office","district","party","candidate","votes", "electionType", "year"]


import os
import csv

# df = pd.read_csv('/path/to/sample.csv')
# df_reorder = df[['A', 'B', 'C', 'D', 'E']] # rearrange column here
# df_reorder.to_csv('/path/to/sample_reorder.csv', index=False)
c = csv.writer(open("data.csv", "wb"))
c.writerow(s)
from collections import defaultdict

dd = defaultdict(float)
# fileNum = 0
for root, subdirs, files in os.walk("."):
    if ".csv" in files[0]:
    	#for each file
    	for f in files:
    		electionType = ""
    		filename = root + "/"+ f
    		year = root.replace("./Data/","")
    		if not ("ga__primary.csv" in filename or "ga__general.csv" in filename or "ga__general1111.csv" in filename):
    			continue

    		if ("ga__primary.csv" in filename):
    			electionType = "primary"
    		elif ("ga__general.csv" in filename):
    			electionType = "general"    				
    		# print filename

    		# print filename
    		# print filename
    		# if "precinct" in filename:
    		# 	p += 1
    		#opens and reads file
    		content = []
    		with open(filename) as f:
    			content = f.readlines()
    		
    		# print (content)[0]
	    	fieldNames = content[0].split(",")[:6]
	    	# if len(fieldNames)>6:
	    	# print fieldNames
	    	# print content
	    	# print len(content)
	    	data = content[1:]
	    	# print data[0]
	    	# print len(data)	
	    	for line in data:
				line = [line.strip() for line in line.split(",")[:6]] #line[:6]
				line.append(electionType)
				line.append(year)
				# print line
				c.writerow(line)

	    	# if len(fieldNames) == 6:
	    		# print fieldNames
	    	# if len(fieldNames) == 11:
	    	# 	print filename
	    	# 	exit()
	    	# data = content[1:]	
	    	# print len(fieldNames)
	    	# dd[str(len(fieldNames))]+=1
	    	# print ""
	    	# print data

	    	# exit()
	    	# num += 1
    	# print files
    	# exit()
# print p
# exit()

# for k,v in dd.items():
# 	print k, " ", v

# print sum(dd.values())

# print dd.values()
# print num

# for filename in os.listdir(os.getcwd()):

# office,candidate,party,county,votes

