const { expect } = require("chai");

describe("EtherGame", function() {
    let EtherGame, etherGame, accounts;

    beforeEach(async() => {
        EtherGame = await ethers.getContractFactory("EtherGame");
        etherGame = await EtherGame.deploy();
        accounts = await ethers.getSigners();
    });
    describe('Upon deployment', () => {
        it('Has a balance of zero', async () => {
            expect(await etherGame.getBalance()).to.equal(0);
        })
    })
    describe('Testing the deposit function', () => {
        it('Allows user to send 1 ether', async () => {
            await etherGame.deposit({value: ethers.utils.parseEther("1.0")});
            expect(await etherGame.getBalance()).to.equal(ethers.utils.parseEther("1.0"));
        });
        it('Allows multiple users to send 1 ether', async () => {
            await etherGame.deposit({value: ethers.utils.parseEther("1.0")});
            etherGame.connect(accounts[1]);
            await etherGame.deposit({value: ethers.utils.parseEther("1.0")});
            expect(await etherGame.getBalance()).to.equal(ethers.utils.parseEther("2.0"));
        });
        it('Selects a winner after 7 ether reaches the smart contract', async () => {
            for (let i = 0; i < 7; i++) {
                await etherGame.deposit({value: ethers.utils.parseEther("1.0")});
            }
            expect(await etherGame.winner()).to.equal(accounts[0].address);
        });
        it('Does not let user send more ether if 7 ether has been sent', async () => {
            for (let i = 0; i < 7; i++) {
                await etherGame.deposit({value: ethers.utils.parseEther("1.0")});
            }
            try {
                await etherGame.deposit({value: ethers.utils.parseEther("1.0")});
            } catch {
                expect(await etherGame.getBalance()).to.equal(ethers.utils.parseEther("7.0"));
            }
        });
        it('Does not let user send more than 1 ether to the deposit function in a single call', async() => {
            try {
                await etherGame.deposit({value: ethers.utils.parseEther("2.0")});
            } catch {
                expect(await etherGame.getBalance()).to.equal(0);
            }
        });
    });
    describe('Testing the claimReward function', () => {
        it('Does not allow user to claim reward if target is less than 7', async () => {
            await etherGame.deposit({value: ethers.utils.parseEther("1.0")});
            try {
                await etherGame.claimReward();
            } catch {
                expect(await etherGame.getBalance()).to.equal(ethers.utils.parseEther("1.0"));
            }
        });
        it('Does allows user to claim reward if target is met', async () => {
            for (let i = 0; i < 7; i++) {
                await etherGame.deposit({value: ethers.utils.parseEther("1.0")});
            }
            await etherGame.claimReward();
            expect(await etherGame.getBalance()).to.equal(0);
        });
        it('Does not allow a different user to claim award', async () => {
            for (let i = 0; i < 7; i++) {
                await etherGame.connect(accounts[0]);
                await etherGame.deposit({value: ethers.utils.parseEther("1.0")});
            }
            await etherGame.connect(accounts[1]);
            try {
                await etherGame.connect(accounts[1]).claimReward();
            } catch {
                expect(await etherGame.getBalance()).to.equal(ethers.utils.parseEther("7.0"));
            }
        });
    });
  
});
