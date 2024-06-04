enum PaymentMethod {
	Paypal = 'paypal',
	Visa = 'visa',
	Bitcoin = 'bitcoin'
}

abstract class PaymentService {
	abstract payMoney(amount: number): void;
}

class Paypal extends PaymentService {
	override payMoney(amount: number): void {
		console.log(`You paid ${amount} dollars by Paypal.`);
	}
}
class Visa extends PaymentService {
	override payMoney(amount: number): void {
		console.log(`You paid ${amount} dollars by Visa.`);
	}
}
class Bitcoin extends PaymentService {
	override payMoney(amount: number): void {
		console.log(`You paid ${amount} dollars by Bitcoin.`);
	}
}

abstract class PaymentFactory {
	abstract createPaymentService(): PaymentService;
}

class PaypalFactory extends PaymentFactory {
	override createPaymentService(): PaymentService {
		return new Paypal();
	}
}
class VisaFactory extends PaymentFactory {
	override createPaymentService(): PaymentService {
		return new Visa();
	}
}
class BitcoinFactory extends PaymentFactory {
	override createPaymentService(): PaymentService {
		return new Bitcoin();
	}
}

function getPaymentFactory(payment: PaymentMethod) {
	switch (payment) {
		case PaymentMethod.Paypal:
			return new PaypalFactory();
		case PaymentMethod.Visa:
			return new VisaFactory();
		case PaymentMethod.Bitcoin:
			return new BitcoinFactory();
	}
}

const paypalService = getPaymentFactory(PaymentMethod.Paypal).createPaymentService();
paypalService.payMoney(500);
const visaService = getPaymentFactory(PaymentMethod.Visa).createPaymentService();
visaService.payMoney(1000);
const bitcoinService = getPaymentFactory(PaymentMethod.Bitcoin).createPaymentService();
bitcoinService.payMoney(1500);
