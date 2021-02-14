const { expect } = require("chai");

describe("Attack", function() {
    let EtherGame, etherGame, Attack, attack, accounts;

    beforeEach(async() => {
        EtherGame = await ethers.getContractFactory("EtherGame");
        etherGame = await EtherGame.deploy();
        Attack = await ethers.getContractFactory("Attack");
        attack = await Attack.deploy();
        accounts = await ethers.getSigners();
    });
    
    describe('Test out the attack function', () => {
        it('Attack contract can send ether to the EtherGame contract', async () => {
            for (let i = 0; i < 2; i++) {
                await etherGame.connect(accounts[i]);
                await etherGame.deposit({value: ethers.utils.parseEther("1.0")});
            }
            await attack.attack(etherGame.address, {value: ethers.utils.parseEther("5.0")});
            expect(await etherGame.getBalance()).to.equal(ethers.utils.parseEther("7.0"));
        });
        it('Attack contract can send ether to the EtherGame contract; winner never gets set', async () => {
            for (let i = 0; i < 2; i++) {
                await etherGame.connect(accounts[i]);
                await etherGame.deposit({value: ethers.utils.parseEther("1.0")});
            }
            await attack.attack(etherGame.address, {value: ethers.utils.parseEther("5.0")});
            expect(await etherGame.winner()).to.equal('0x0000000000000000000000000000000000000000');
        });
    });
});
