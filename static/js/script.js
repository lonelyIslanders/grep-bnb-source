async function getTransactions() {
    const pp = document.getElementById('pp');
    const address = document.getElementById("address").value;
    const table = document.getElementById("transactions");
    const dateInput = document.getElementById("date-input").value;
    if (address == '' || address == null) {
        pp.textContent = '请输入地址';
        return;
    }
    if (dateInput == '' || dateInput == null) {
        pp.textContent = '请选择日期';
        return;
    }
    pp.textContent = '正在查询……请稍等，数据可能巨大，加载很耗时哦 😇';
    const response = await fetch("http://localhost:9615/post/grepBNBSource", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, dateInput }),
    });
    const data = await response.json();
    console.log(data)
    const result = data.sort(function (a, b) {
        return new Date(a.date.date) - new Date(b.date.date);
    });
    if (!response.ok) {
        pp.textContent = data.message;
    } else {
        pp.textContent = `查询OK，共${result.length}条记录`
    }

    table.innerHTML = `
  <tr>
    <th>时间</th>
    <th>发送地址</th>
    <th>接收地址</th>
    <th>数量</th>
    <th>交易哈希</th>
  </tr>
`;
    result.forEach(tx => {
        console.log(tx)
        const time = tx.date.date;
        const from = tx.sender.address;
        const to = tx.receiver.address;
        const value = tx.amount;
        const hash = tx.transaction.hash;
        const row = `
    <tr>
      <td>${time}</td>
      <td>${from}</td>
      <td>${to}</td>
      <td>${value}</td>
      <td><a href='https://bscscan.com/tx/${hash}' target="_blank">${hash}</a></td>
    </tr>
  `;
        table.innerHTML += row;
    });
}



