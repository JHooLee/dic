const query = document.getElementById('search')
const submitButton = document.getElementById('submit')
// const optionW = document.getElementById('optionw')
// const optionM = document.getElementById('optionm')
// const optionWM = document.getElementById('optionwm')
const BASE_URL = 'http://localhost:5500/api/words'
// const BASE_URL = 'https://dictionary-search-jhl.herokuapp.com/api/words'
function checkIfStringHasSpecialCharacter(str) {//특수문자 포함 여부
    // const re = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    const re = /[`!@#$%^&*()_+\-=\[\]{};':"\\|.<>\/?~]/;//공백과 , 제외
    return re.test(str);
}
function checkIfStringHasNumbers(str) {//숫자 포함 여부
    return /\d/.test(str);
}
function checkIfStringHasLetters(str){//영어 포함 여부
    return /[a-z]/i.test(str)///[a-zA-Z]
}
function enableSubmitButton(state){
    submitButton.disabled = state
}
// 서버 데이터 가져오기

function getData(baseUrl, query){
    console.log('서버 접속 중')
    //사용자 입력 유효성 검증
    //버튼 비활성화
    enableSubmitButton(true)
    // console.log(checkIfStringHasSpecialCharacter(query))
    if(checkIfStringHasSpecialCharacter(query)){
        enableSubmitButton(false)
        con.innerHTML="특수문자는 사용할 수 없습니다."
        container.innerHTML=""
        document.getElementById('line').style.visibility = "hidden"
        return;
    }
    if(checkIfStringHasNumbers(query)){
        enableSubmitButton(false)
        con.innerHTML="숫자는 사용할 수 없습니다."
        container.innerHTML=""
        document.getElementById('line').style.visibility = "hidden"
        return;
    }
    if(checkIfStringHasLetters(query)){
        enableSubmitButton(false)
        con.innerHTML="영어는 사용할 수 없습니다."
        container.innerHTML=""
        document.getElementById('line').style.visibility = "hidden"
        return;
    }
    
    fetch(`${baseUrl}/${query}`, {
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(data => {
        //버튼 활성화
        
        enableSubmitButton(false)
        console.log(data)
        const {words} = data;
        document.getElementById('line').style.visibility = "visible"
        if(words.length === 0){//데이터 유효성 검증
            con.innerHTML = "검색된 단어가 없습니다."
            container.innerHTML = ""
            document.getElementById('line').style.visibility = "hidden"
            return;
        }    
        // document.getElementById('line').style.backgroundColor = rgb(255,224,224)

        const template = words.map(word => {
            // if(word.r_seq == undefined){
            //     word.r_seq = "";
            // }
            
            return (
                `
                    <div class="item">
                        <div class="r_word">
                            <a href="${word.r_link}" style="text-decoration:none"><b>${word.r_word}</b> <sup>${word.r_seq? word.r_seq:""}</sup></a>
                            ${word.r_chi}
                            <p>${word.r_pos}
                            ${word.r_des}
                            <a href="${word.r_link}" style="white-space:nowrap;"><button>>전체보기</button></a></p>
                        </div>
                    </div>
                `
            )
        })
        
         con.innerHTML = "'" + query + "'" +" 검색 결과 "+ template.length + " 개"
         container.innerHTML = template.join("")
    })
}

submitButton.addEventListener('click', function(){
    console.log(query.value)

    getData(BASE_URL, query.value)
})
query.addEventListener('keypress', function(e){
    if(e.keyCode === 13){
        getData(BASE_URL, query.value)
    }
})
window.addEventListener('DOMContentLoaded', function(){
    getData(BASE_URL, query.value)
})