const monthNameFromGiftDate = require('./monthNameFromGiftDate');
const prompt = require('prompt-sync')();

const {
    doc,
    getDoc,
    updateDoc,
} = require('firebase/firestore')

let handleCSV = (db) => (req, res) => {
    console.log('received CSV')

    const data = req.body
	const email = req.headers.email
    
    array1 = data.split('\n')
	let designationcode = array1[1].split('","')[11]
    let giftDate = array1[1].split('","')[9]
    
    var monthName = monthNameFromGiftDate(giftDate)
	array2 = []
    donationsArray=[]
    var donorsObject={}
    const CSVDonorCodes = []
	for (let x in array1) {
		let row = array1[x].split('","')
		array2.push(row)
		if (x > 0) {
			if (row.length === 3) {
				let row2 = array1[Number(x)+1].split('","')
				if (row2.length > 1) {
                    key = row[0].replace('"','')
                    donorsObject[key] = {
                        donorcode : row[0].replace('"',''),
                        name : row[1],
                        city : row2[1],
                        state : row2[2],
                        postalcode : row2[3],
                        email : row2[5],
                        address : row[2]+row2[0],
                        phone : row2[4],
                    }
                    CSVDonorCodes.push(donorsObject[key].donorcode)
                    donationsArray.push({
                        donorcode : row[0].replace('"',''),
                        donorname : row[1],
                        code : row2[6],
                        amount : row2[8],
                        giftdate : row2[7],
                        designationcode : row2[9],
                        designationname : row2[10],
                        motivationcode : row2[11],
                        paymentmethodcode : row2[12],
                        tenderedamount : row2[13],
                        tenderedcurrency : row2[14],
                        memo : row2[18]
                    })}
			} else if (row.length ===22){
                key = row[0].replace('"','')
                donorsObject[key] = {
                    donorcode : row[0].replace('"',''),
                    name : row[1],
                    city : row[3],
                    state : row[4],
                    postalcode : row[5],
                    email : row[7],
                    address : row[2],
                    phone : row[6],
                }
                CSVDonorCodes.push(donorsObject[key].donorcode)
                donationsArray.push({
                    donorcode : row[0].replace('"',''),
                    donorname : row[1],
                    code : row[8],
                    amount : row[10],
                    giftdate : row[9],
                    designationcode : row[11],
                    designationname : row[12],
                    motivationcode : row[13],
                    paymentmethodcode : row[14],
                    tenderedamount : row[15],
                    tenderedcurrency : row[16],
                    memo : row[20]
                })
                designationcode = row[11]
			}
		}
    }
    var donationsObject = {};
    donationsObject[monthName] = donationsArray;

    //grab contacts then see which donors dont have a donor code
    let docRef1 = doc(db, email, "contacts");
    const docSnap = getDoc(docRef1)
    .then((docSnap)=>{
        let contacts = docSnap.data()
        newContactsObject = {}
        if (contacts) {
            names = Object.keys(contacts)
            let existingDonorCodes = []
            names.map((name)=>{
                if (contacts[name].donorcode) {
                    existingDonorCodes.push(contacts[name].donorcode)
                }
            })
            let newDonorCodes = CSVDonorCodes.filter(element => !existingDonorCodes.includes(element))
            newDonorCodes.map((code)=>{
                let name = donorsObject[code].name
                newContactsObject[name]=donorsObject[code]
            })
        } else {
            donorCodes = Object.keys(donorsObject)
            donorCodes.map((code)=>{
                let name = donorsObject[code].name
                newContactsObject[name]=donorsObject[code]
            })
            contacts = {}
        }
        
        docRef = doc(db, email, "donations");
        updateDoc(docRef, donationsObject)
        let responseObject = {
            existingContacts:contacts,
            newContacts:newContactsObject
        }
        res.json(responseObject)
        
    }
    )

}

module.exports = handleCSV