$(document).ready(
	function() {
		var clePriv = chargeClePrive();
		var messageCrypteB64 = $('#message-body').text();
		var messageCrypte = base64ToByteArray(messageCrypteB64);
		var cleSymCrypte = $("meta[name='cleA']").attr('content');
		var cleSymB64 = dechiffreAsym(cleSymCrypte, clePriv);
		var cleSym = base64ToByteArray(cleSymB64);
		var message = dechiffreSym(messageCrypte, cleSym);
		$('#message-body').text(message);
	}
)

function chargeClePrive()
{
	return "MIICXAIBAAKBgQCT+BMdNn4LGQgZtT53EmQ9sAqajMofTQzkfSKM++4recuoiG8BRWkEsrPwBQFHpfC3hi/kDpdLEITjcJRgLVDfUIkUI+9bIs8WV/hpwCZfUSoqzbvROMRGWEMIfvWE8u1d8Efz/pji86CQue9ujMHJNVInHZKSH0PqP/T6U3SgyQIDAQABAoGAFxjkMu0so6LWptyp0YBncVGndhSAAH7QgmIeII+6z8KFTdtuKG6jQ/55JABEAOEgQCWMGDdG2orLk40hPBoWw2hVh/xyegBQ1AzWNqBXFOIALfhtuDlqUQaL+0A0nnCsbXeKsxjK3tZSEojgAG/8+nuPgVplCuDTeudYJvVMJeECQQDD1QYcCIMAdGEf8E/+ME3PD6xAshrX+VkiALsyS57iFrqxnPqF7H7N//nAxHxvt2ZFkxTzkaCUjOhyK51+Q4clAkEAwW5txmBNOo6mQzxqRb9IyP8Eqqy0jEWJCuQ3ErXYHq4lBbVEwfIeWVrmei4qhM53V8xccGmdKalAGBUt2cTD1QJAEUGhQzEg0hZvRJA5jE2XXaqk5CKNqQBo8U0dMcZmHsgf9Wy+yrRXTDHFQU5PJM0FbxYR35CylMSB6yWawDiVHQJAWGuoVpRS+T+YFQga9EMafHbGpVZJOg3XNVlZK35girXESrWv9pA8+0+oJ5XO7eKLf2D1qJU+uHqbx+Z2jSN6+QJBAKrqFvDjzWsXscrpQ7tak3J2cKmVKaXVm3wZxHe7cym7a0BLaZAk6JTwjx+N7d6LkBHK+BCugjpfN0AKTWDS92Q=";
}