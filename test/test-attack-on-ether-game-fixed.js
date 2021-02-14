const { expect } = require("chai");

describe("Attack on EtherGameFixed", function() {
    let EtherGameFixed, etherGameFixed, Attack, attack, accounts;

    beforeEach(async() => {
        EtherGameFixed = await ethers.getContractFactory("EtherGameFixed");
        etherGameFixed = await EtherGameFixed.deploy();
        Attack = await ethers.getContractFactory("Attack");
        attack = await Attack.deploy();
        accounts = await ethers.getSigners();
    });
    
    describe('Test out the attack function', () => {
        it('Attack contract can send ether to the EtherGameFixed contract', async () => {
            for (let i = 0; i < 2; i++) {
                await etherGameFixed.connect(accounts[i]);
                await etherGameFixed.deposit({value: ethers.utils.parseEther("1.0")});
            }
            await attack.attack(etherGameFixed.address, {value: ethers.utils.parseEther("5.0")});
            expect(await etherGameFixed.getBalance()).to.equal(ethers.utils.parseEther("2.0"));
        });
        it('Attack contract can send ether to the EtherGame contract; winner never gets set', async () => {
            for (let i = 0; i < 2; i++) {
                await etherGameFixed.connect(accounts[i]);
                await etherGameFixed.deposit({value: ethers.utils.parseEther("1.0")});
            }
            await attack.attack(etherGameFixed.address, {value: ethers.utils.parseEther("5.0")});
            expect(await etherGameFixed.winner()).to.equal('0x0000000000000000000000000000000000000000');
        });
    });
});
