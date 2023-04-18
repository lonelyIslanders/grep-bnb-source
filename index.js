const express = require('express');
const cors = require('cors')
const tools = require('./tools/index');
const app = express();

app.use(cors());
app.use(express.static('./static'));


//查询BNBSource
app.post('/post/grepBNBSource', async (req, res) => {
    let data = [];
    const address = req.body.address;
    const inputDate = req.body.dateInput;
    console.log({ address, inputDate })
    if (address == '') {
        res.status(400).send({ message: '请输入地址' });
        return;
    }
    if (!await tools.isVaildAddress(address)) {
        res.status(400).send({ message: '无效地址，请重新输入' })
        return;
    }
    if (inputDate == '') {
        res.status(400).send({ message: '请输入有效截至日期' })
        return;
    }
    const result = await tools.grep(address, inputDate);
    data.push(result);
    for (const transfer of result) {
        try {
            const data = await tools.grep(transfer.sender.address, inputDate);
            data.push(result)
        } catch (e) {
            res.status(400).send({ message: "error" });
            break;
        }
    }
    const final = flatten(data).filter(item => new Date(item.date.date) > new Date(inputDate));
    console.log('查询结果', final)
    res.json(final);
});

app.listen(9615, () => {
    console.log("run at 9615")
});