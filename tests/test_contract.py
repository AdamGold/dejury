import unittest
from contracting.client import ContractingClient

CONTRACT_NAME = "con_dejury"
client = ContractingClient()

with open("../contracts/currency.py") as currency, open(
    f"../contracts/{CONTRACT_NAME}.py"
) as contract:
    for idx, current in enumerate([currency, contract]):
        code = current.read()
        client.submit(code, name=CONTRACT_NAME + str(idx))


class TestContract(unittest.TestCase):
    con_smack_that = None
    currency_contract = None

    def get_contracts(self):
        self.main_contract = client.get_contract(CONTRACT_NAME + "1")
        self.currency_contract = client.get_contract("currency")

    def test_post(self, name):
        self.get_contracts()
        self.main_contract.post("test", "test test", 300)
        self.assertEqual(
            self.main_contract.quick_read(
                "posts",
            ),
            40,
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
