const Data = {
  Vehicle: ["releaseYear"], //"model", "brand", "Vehiclenumber",
  Person: [
    "UserName",
    "firstName",
    "lastName",
    "gender-Abbr",
    "email",
    "dob",
    "salary",
    "Serial-Id",
    "title",
    "phoneNo",
    "profession",
    "maritalStatus",
    "age",
    "weight",
  ], //"gender","experience","no Of Children","education"
  Address: [
    "country-code",
    "state-Abbr",
    "country",
    "city",
    "state",
    "street",
    "zipcode",
    "latitude",
    "longitude",
  ],
  Colors: ["Colorname", "hex", "rgb"],
  Text: ["letter", "emoji", "paragraph", "sentence", "word", "string"],
  GeographicalData: ["continent", "timezone", "latitude", "longitude"],
  CreditCards: ["Creditcard-company", "cardNo", "expiration-date"],
  DeviceIDs: [
    "deviceName",
    "ipv4-Address",
    "ipv6-Address",
    "Mac-Address",
    "UserAgent",
  ], //"category", "type",
  EncryptedData: ["sha-256", "sha-1"], //'base64',
  UserInfo: ["userName", "password"], //"encryptedPassword", "userImage"
  Image: ["ImageURL"],
  Number: ["digit", "float", "integer", "double", "amount"], //"auto-incrementId"
  //   Products:[ "name", "category", "subcategory", "price", "salePrice", "discount%"] ,
  // Mongo:["objectid"]  ,
  Boolean: ["boolean", "0/1"],
  DateTime: [
    "dd-mm-yyyy",
    "dd/mm/yyyy",
    "year",
    "day",
    "day-Abbr",
    "month",
    "month-Abbr",
    "hh:mm:ss:ms",
    "hh:mm:ss",
    "am/pm",
    "timezone",
  ], //"dd-mm-yyyy hh:mm:ss"
  Others: ["schoolClass"],
};
export default Data;

export type Field = {
  fieldName: string;
  dataType: string[];
}

const ExistingSchemas:Record<string, Array<Field>> = {
  Hospital: [
    {
      fieldName: "Doctor Id",
      dataType: ["Serial-Id"],
    },
    {
      fieldName: "Doctor Name",
      dataType: ["UserName"],
    },
    {
      fieldName: "Patient Name",
      dataType: ["UserName"],
    },
    {
      fieldName: "Patient Id",
      dataType: ["Serial-Id"],
    },
    {
      fieldName: "Patient Gender",
      dataType: ["gender-Abbr"],
    },
    {
      fieldName: "Hospital Name",
      dataType: ["UserName"],
    },
    {
      fieldName: "Hospital Id",
      dataType: ["Serial-Id"],
    },
    {
      fieldName: "Hospital Address",
      dataType: ["street", "zipcode", "country"],
    },
    {
      fieldName: "Zipcode",
      dataType: ["zipcode"],
    },
    {
      fieldName: "State",
      dataType: ["state"],
    },
    {
      fieldName: "Room No",
      dataType: ["Serial-Id"],
    },
    {
      fieldName: "Admission Date",
      dataType: ["dd-mm-yyyy"],
    },
    {
      fieldName: "Patient Weight",
      dataType: ["weight"],
    },
    {
      fieldName: "Patient Age",
      dataType: ["age"],
    },
    {
      fieldName: "Patient PhoneNo",
      dataType: ["phoneNo"],
    },
    {
      fieldName: "Discharge Date",
      dataType: ["dd-mm-yyyy"],
    },
    {
      fieldName: "Bill Amount",
      dataType: ["amount"],
    },
  ],
  School: [
    {
      fieldName: "Student Id",
      dataType: ["Serial-Id"],
    },
    {
      fieldName: "Student Name",
      dataType: ["UserName"],
    },
    {
      fieldName: "Student Gender",
      dataType: ["gender-Abbr"],
    },
    {
      fieldName: "Teacher Name",
      dataType: ["UserName"],
    },
    {
      fieldName: "Teacher Id",
      dataType: ["Serial-Id"],
    },
    {
      fieldName: "School Name",
      dataType: ["UserName"],
    },
    {
      fieldName: "Admission Number",
      dataType: ["Serial-Id"],
    },
    {
      fieldName: "School Address",
      dataType: ["street", "zipcode", "country"],
    },
    {
      fieldName: "Zipcode",
      dataType: ["zipcode"],
    },
    {
      fieldName: "State",
      dataType: ["state"],
    },
    {
      fieldName: "Class",
      dataType: ["schoolClass"],
    },
    {
      fieldName: "Admission Date",
      dataType: ["dd-mm-yyyy"],
    },
    {
      fieldName: "Student Age",
      dataType: ["age"],
    },
    {
      fieldName: "Teacher PhoneNo",
      dataType: ["phoneNo"],
    },
    {
      fieldName: "Parent PhoneNo",
      dataType: ["phoneNo"],
    },
    {
      fieldName: "Fee Amount",
      dataType: ["amount"],
    },
  ],
  Organization: [
    {
      fieldName: "Employee Id",
      dataType: ["Serial-Id"],
    },
    {
      fieldName: "Employee Name",
      dataType: ["UserName"],
    },
    {
      fieldName: "Employee Gender",
      dataType: ["gender-Abbr"],
    },
    {
      fieldName: "Manager Name",
      dataType: ["UserName"],
    },
    {
      fieldName: "Manager Id",
      dataType: ["Serial-Id"],
    },
    {
      fieldName: "Organization Name",
      dataType: ["UserName"],
    },
    {
      fieldName: "Employee Address",
      dataType: ["street", "zipcode", "country"],
    },
    {
      fieldName: "Zipcode",
      dataType: ["zipcode"],
    },
    {
      fieldName: "State",
      dataType: ["state"],
    },
    {
      fieldName: "Job",
      dataType: ["profession"],
    },
    {
      fieldName: "Joining Date",
      dataType: ["dd-mm-yyyy"],
    },
    {
      fieldName: "Employee Age",
      dataType: ["age"],
    },
    {
      fieldName: "Employee PhoneNo",
      dataType: ["phoneNo"],
    },
    {
      fieldName: "Salary",
      dataType: ["salary"],
    },
  ],
  Bank: [
    {
      fieldName: "Bank Id",
      dataType: ["Serial-Id"],
    },
    {
      fieldName: "Bank Name",
      dataType: ["UserName"],
    },
    {
      fieldName: "Branch Name",
      dataType: ["UserName"],
    },
    {
      fieldName: "Branch Address",
      dataType: ["street", "zipcode", "country"],
    },
    {
      fieldName: "Zipcode",
      dataType: ["zipcode"],
    },
    {
      fieldName: "State",
      dataType: ["state"],
    },
  ],
};

export { ExistingSchemas };
/*
base64: base64.b64encode(f.text(max_nb_chars=15).encode())---->import base64
hh:mm:ss:ms :time(pattern="%H:%M:%S:%S")
0/1:  f.random.choice([0,1])
objectID:bson.objectid.ObjectId()--->import bson
empid:.random_int(min=100, max=999)
salary:round(random.randint(90000,120000)/1000)*1000
profession:job
randomNumber/children/age:f.random.number(min,max)
releaseYear:year
phonrNo:phone_number
email:email
gender-Abbr:passport_gender
lastName:last_name
firstName:first_name
zipcode:zipcode
city:city
state:state
street:street_name
state-Abbr:state_abbr
contry-Abbr:country_code
country:country
hex:color
Colorname:color_name
rgb:rgb_color
word:word
sentence:sentence
paragraph:paragraph
letter:random_letter
ascii
emoji:emoji
sha-1:sha1
sha-256:sha256
image:image_url
password:password
ipv4-Address:ipv4
ipv6-Address:ipv6
Mac-Address:mac_address
UserAgent:user_agent
deviceName:unix_device
userName:user_name
latitude:latitude
longitude:longitude
cardNo:credit_card_number
company:credit_card_provider.split(' ')[0]
expiration-date:credit_card_expire
am/pm :am_pm
dob:date_of_birth
date[dd-mm-yyyy]:date(pattern="%d-%m-%Y")
day-Abbr:day_of_month()[:3]
dd/mm/yyyy:date(pattern="%d/%m/%Y")
day:day_of_month()
month:month,
month_Abbr:month_name
year:year,
hh:mm:ss:time
timezone:timezone
boolean:boolean
digit:random_digit
float:pyfloat
int:pyint
string:text(max_nb_chars=15)
number:pyint
*/

// Custom list

// Regular Exp

// Url, domain, filename, md5 hash, mime type

// Save a formula
