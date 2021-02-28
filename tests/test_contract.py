import unittest
from contracting.client import ContractingClient

CONTRACT_NAME = "con_dejury"
client = ContractingClient()

with open("./tests/currency.py") as currency, open(
    f"./contracts/{CONTRACT_NAME}.py"
) as contract:
    code = currency.read()
    client.submit(code, name="currency")
    code = contract.read()
    client.submit(code, name=CONTRACT_NAME)


class TestContract(unittest.TestCase):
    main_contract = None
    currency_contract = None

    def get_contracts(self, signer: str):
        client.signer = signer
        self.main_contract = client.get_contract(CONTRACT_NAME)
        self.currency_contract = client.get_contract("currency")

    def test_post(self):
        self.get_contracts("me")
        self.assertRaises(
            AssertionError,
            lambda: self.main_contract.post("test", "test test", 300),
        )
        self.currency.quick_write("balances", "me", 10000)
        self.main_contract.post("test", "test test", 300)
        self.assertEqual(
            self.main_contract.quick_read("posts", "me", ["test"]),
            {"content": "test test", "bounty": 300, "bounty_given": False},
        )

    def test_answer(self):
        pass

    def test_award(self):
        pass

    def test_empty_post(self):
        pass

    def test_empty_answer(self):
        pass

    def test_wrong_award(self):
        pass

    def test_double_award(self):
        pass

    def test_post_without_enough_money(self):
        pass

    def test_award_not_owner(self):
        pass


if __name__ == "__main__":
    unittest.main()
