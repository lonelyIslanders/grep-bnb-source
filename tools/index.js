const ethers = require('ethers');
module.exports = {
  //graphql语句
  async grep(address, inputDate) {
    return new Promise(async (res, rej) => {
      const query = `
    {
        ethereum(network: bsc) {
          transfers(
            receiver:{is:"${address}"}
            currency: {is: "BNB"}
            amount: {gt: 0}
            date: {after: "${inputDate}"}
          ) {
            date {
              date
            }
            sender{address}
            receiver{address}
              currency {
              symbol
            }
            amount
            transaction{hash}
          }
        }
    }`;
      const client = new GraphQLClient('https://graphql.bitquery.io', {
        headers: {
          'X-API-KEY': 'BQYK3EWrHPiGj7z0wZ8iUSpBWygRq1Gh'
        }
      });
      try {
        res((await client.request(query)).ethereum.transfers);
      } catch (e) {
        rej(e)
      }
      // res((await client.request(query)).ethereum.transfers);
    })
  },

  //判断一个地址是否是有效地址
  async isVaildAddress(address) {
    if (!ethers.utils.isAddress(address)) {
      return false;
    } else {
      return true;
    }
  },

}