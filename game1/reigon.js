async function getRegion() {
    try {
        const response = await fetch('http://ip-api.com/json/'); //an alternative http://ipwho.is
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}
if (localStorage.getItem("regionlck") === null){
getRegion().then(data => {
    console.log(data);
    let region = data['country'];
    console.log(region);
    if(region === "United States"){
        if (data["regionName"] !== "California"){
            localStorage.setItem("regionlck", "0");
            alert("This product is not currently avaliable in your state.");
            
            window.location.href = "index.html";
        } else{
            localStorage.setItem("regionlck", "1");
        }
    } else {
        localStorage.setItem("regionlck", "0");
        alert("You are not in the United States, you will be redirected to the main page");
        window.location.href = "index.html";
    }
});
} else {
    localStorage.getItem("regionlck");
    if(localStorage.getItem("regionlck") === "0"){
        window.location.href = "index.html";
    }

}