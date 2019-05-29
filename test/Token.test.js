import {tokens, EVM_REVERT} from './helpers';
const Token = artifacts.require("Token");
require('chai').use(require('chai-as-promised')).should();

contract('Token', ([deployer, exchanger, receiver]) => {
    let token;
    const name = 'R Token';
    const symbol = 'R';
    const decimals = '18';
    const totalSupply = tokens(1000000).toString();
    beforeEach(async () => {
        token = await Token.new();
    });
        describe('deployment', () => {
    	it('tracks the name', async () => {
    		const result = await token.name();
    		result.should.equal(name);
    	});

    	it('tracks the symbol', async () => {
    		const result = await token.symbol();
    		result.should.equal(symbol);
    	});

    	it('tracks the decimals', async () => {
    		const result = await token.decimals();
    		result.toString().should.equal(decimals);
    	});

    	it('tracks the total suuply', async () => {
    		const result = await token.totalSupply();
    		result.toString().should.equal(totalSupply);
    	});

    	it('assigns the total supply to the deployer', async () => {
    		const result = await token.balanceOf(deployer);
    		result.toString().should.equal(totalSupply);
    	});
    });

	describe('sending tokens', () => {
        let amount;
        let result;

        describe('Success', async () => {
            beforeEach(async () => {
                amount = tokens(100);
                result = await token.transfer(receiver, amount, {from: deployer});
            });

            it('transfer token balances', async () => {
                let balanceOf;
                balanceOf = await token.balanceOf(deployer);
                balanceOf.toString().should.equal(tokens(999900).toString());
                balanceOf = await token.balanceOf(receiver);
                balanceOf.toString().should.equal(tokens(100).toString());
            });

            it('emits a Transfer event', async () => {
                const log = result.logs[0];
                log.event.should.equal('Transfer');
                const event = log.args;
                event.from.should.equal(deployer, 'from is correct');
                event.to.should.equal(receiver, 'to is correct');
                event.value.toString().should.equal(amount.toString(), 'Value is correct');
            });
        });

        describe('Failure', async () => {
            it('reject insufficient balances', async () => {
                let invalidAmount;
                invalidAmount = tokens(100000000); // 100 million - greater than the total supply
                await token.transfer(receiver, invalidAmount, { from: deployer }).should.be.rejectedWith(EVM_REVERT);

                // Attemp to transfer tokens, when you have none
                invalidAmount = tokens(10); // recepient has no tokens
                await token.transfer(deployer, invalidAmount, { from: receiver}).should.be.rejectedWith(EVM_REVERT);

            });

            it('Rejects invalid recepient', async () => {
                await token.transfer(0x0, amount, {from: deployer}).should.be.rejected;
            });
        });
	});

    describe('approving tokens', () => {
        let result;
        let amount;

        describe('Success', () => {
            beforeEach(async () => {
                amount = tokens(100);
                result = await token.approve(exchanger, amount, {from: deployer});
            });

            it('allocate an allowance for delegated token spending on exchange', async () => {
                const allowance = await token.allowance(deployer, exchanger);
                allowance.toString().should.equal(amount.toString());
            });

            it('emits t Approval event', async () => {
                const log = result.logs[0];
                log.event.should.equal('Approval');
                const event = log.args;
                event.owner.should.equal(deployer, 'owner is correct');
                event.spender.should.equal(exchanger, 'spender is correct');
                event.value.toString().should.equal(amount.toString(), 'Value is correct');
            });
        });

        describe('Failure', () => {
            it('reject invalid spenders', async () => {
                await token.approve(0x0, amount, {from: deployer}).should.be.rejected;
            })
        });
    });
});