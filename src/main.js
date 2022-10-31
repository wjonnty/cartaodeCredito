import IMask from 'imask'
import "./css/index.css"

const ccBgColor1=document.querySelector('.cc-bg svg>g g:nth-child(1) path')
const ccBgColor2=document.querySelector('.cc-bg svg>g g:nth-child(2) path')
const ccLogo=document.querySelector('.cc-logo span:nth-child(2)>img')
const CVC=document.querySelector('#security-code')
const expiration=document.querySelector('#expiration-date')
const cardNumber=document.querySelector('#card-number')

const addButton=document.querySelector('button')

const time=new Date()
const year=time.getFullYear().toLocaleString('pt-BR')

function setCardFlag(flag){
	const flags={
		visa:['#2D57F2','#436D99'],
		mastercard:['#C69347','#DF6F29'],
		porco:['#FDB39C','#9D4F44'],
		default:['black','gray']

	}

	ccBgColor1.setAttribute('fill',flags[flag][0])
	ccBgColor2.setAttribute('fill',flags[flag][1])
	ccLogo.setAttribute('src',`/cc-${flag}.svg`)
}


const maskCVC={
	mask:'0000'
}
const maskCVC_Call=IMask(CVC,maskCVC)

const maskExpiration={
	mask:'MM{/}YY',
	blocks:{
		MM:{
			mask:IMask.MaskedRange,
			from:1,
			to:12
		},
		YY:{
			mask:IMask.MaskedRange,
			from:year.slice(3),
			to:Number(year.slice(3))+5
		}

	}
}
const maskExpiration_Call=IMask(expiration,maskExpiration)

const maskCardNumber={
	mask:[
		{
			mask:'0000 0000 0000 0000',
			regex:/^4\d{0,15}/,
			cardtype:'visa',
		},

		{
			mask:'0000 0000 0000 0000',
			regex:/(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
			cardtype:'mastercard',

		},

		{

			mask:'0000 0000 0000 0000',
			regex:/^0326\d{0,15}/,
			cardtype:'porco'

		},
		{

			mask:'0000 0000 0000 0000',
			cardtype:'default'

		},
	],	
	dispatch: function (appended, dynamicMasked) {
      let number = (dynamicMasked.value + appended).replace(/\D/g,'');

      const foundMask=dynamicMasked.compiledMasks.find(function(item){
      	return number.match(item.regex);
      });

       
     
      setCardFlag(foundMask.cardtype)
       return foundMask

    }, 

}


const maskCardNumber_Call=IMask(cardNumber,maskCardNumber)



document.querySelector('form').addEventListener('submit',(event)=>{event.preventDefault()})
addButton.addEventListener('click',()=>alert('Cartão Adicionado'))

const nameValue=document.querySelector('#card-holder')

nameValue.addEventListener('input',()=>{
	const printedName=document.querySelector('.cc-holder .value')
	printedName.innerText=nameValue.value.length===0?'FULANO DA SILVA':nameValue.value

})

maskCVC_Call.on('accept',()=>{MaskCVC_Print(maskCVC_Call.value)})


function MaskCVC_Print(value){
	const CVCprint=document.querySelector('.cc-security .value')
	CVCprint.innerText=value.length===0?'123':value
}

maskExpiration_Call.on('accept',()=>{maskExpiration_Print(maskExpiration_Call.value)})

function maskExpiration_Print(value){
	const ExpirationPrint=document.querySelector('.cc-expiration .value')
	ExpirationPrint.innerText=value.length===0?'02/32':value
}

maskCardNumber_Call.on('accept',()=>{maskCardNumber_Print(maskCardNumber_Call.value)})

function maskCardNumber_Print(value){
	const cardNumberPrint=document.querySelector('.cc-info .cc-number')
	cardNumberPrint.innerText=value.length===0?'1234 5678 9012 3456':value
}



