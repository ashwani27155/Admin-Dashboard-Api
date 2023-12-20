let a = [1, 2, 3, 4, 2, 1];
let n = a.length;
let ans = [];
ans.fill(false)

for (let i = 0; i < n; i++) {
    let count = 0;
    if(ans[i]==true){
        continue;
    }
    for (let j = 0; j < n; j++) {
        if (a[i] === a[j]) {
            count++;
            ans[j] = true; 
        }
    }
        console.log(a[i] + '==' + count);

}
