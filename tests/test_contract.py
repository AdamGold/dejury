import unittest
from contracting.client import ContractingClient

CONTRACT_NAME = "con_dejury"
with open("./tests/currency.py") as currency, open(
    f"./contracts/{CONTRACT_NAME}.py"
) as contract:
    currency_code = currency.read()
    contract_code = contract.read()


class TestContract(unittest.TestCase):
    main_contract = None
    currency_contract = None

    def setUp(self):
        self.client = ContractingClient()
        self.client.flush()

        self.client.submit(currency_code, name="currency")
        self.client.submit(contract_code, name=CONTRACT_NAME)
        self.main_contract = self.client.get_contract(CONTRACT_NAME)
        self.currency_contract = self.client.get_contract("currency")

    def tearDown(self):
        self.client.flush()

    def change_signer(self, signer: str):
        self.client.signer = signer

    def get_contracts(self):
        self.main_contract = self.client.get_contract(CONTRACT_NAME)
        self.currency_contract = self.client.get_contract("currency")

    def post(self):
        self.currency_contract.quick_write("balances", "me", 10000)
        self.currency_contract.approve(amount=1000, to=self.main_contract.name)
        self.main_contract.post(title="test", content="test test", bounty=500)

    def award(self):
        self.change_signer("me")
        self.get_contracts()
        self.change_signer(self.main_contract.name)
        self.get_contracts()
        self.currency_contract.quick_write("balances", self.main_contract.name, 10000)
        self.currency_contract.approve(amount=1000, to=self.client.signer)
        self.change_signer("me")
        self.get_contracts()
        self.main_contract.award(title="test", winner="notme")

    def test_post(self):
        self.change_signer("me")
        self.get_contracts()
        self.assertRaises(
            AssertionError,
            lambda: self.main_contract.post(
                title="test", content="test test", bounty=300
            ),
        )
        self.post()
        expected = {"content": "test test", "bounty": 500}
        for k, v in expected.items():
            self.assertEqual(
                self.main_contract.quick_read("posts", "me", ["test", k]),
                v,
            )

    def test_answer(self):
        self.change_signer("me")
        self.get_contracts()
        self.post()
        self.change_signer("notme")
        self.get_contracts()
        self.currency_contract.approve(amount=1000, to="notme")
        self.main_contract.answer(title="test", content="this is an answer", owner="me")
        self.assertEqual(
            self.main_contract.quick_read("answers", "notme", ["test"]),
            "this is an answer",
        )
        self.assertRaises(
            AssertionError,
            lambda: self.main_contract.answer(
                title="test", content="this is an answer", owner="me"
            ),
        )

    def test_award(self):
        self.change_signer("me")
        self.get_contracts()
        self.post()
        self.assertEqual(
            self.main_contract.quick_read("posts", "me", ["test", "bounty"]), 500
        )
        self.change_signer("notme")
        self.get_contracts()
        self.main_contract.answer(title="test", content="this is an answer", owner="me")
        self.award()
        self.assertEqual(
            self.main_contract.quick_read("posts", "me", ["test", "bounty"]), 0
        )

    def test_empty_post(self):
        self.change_signer("me")
        self.get_contracts()
        self.assertRaises(
            AssertionError,
            lambda: self.main_contract.post(title="test", content="", bounty=300),
        )
        self.assertRaises(
            AssertionError,
            lambda: self.main_contract.post(title="test", content="asda", bounty=-1),
        )

    def test_empty_answer(self):
        self.change_signer("notme")
        self.get_contracts()
        self.assertRaises(
            AssertionError,
            lambda: self.main_contract.answer(title="test", content="", owner="me"),
        )

    def test_double_award(self):
        self.change_signer("me")
        self.get_contracts()
        self.post()
        self.assertEqual(
            self.main_contract.quick_read("posts", "me", ["test", "bounty"]), 500
        )
        self.change_signer("notme")
        self.get_contracts()
        self.main_contract.answer(title="test", content="this is an answer", owner="me")
        self.award()
        self.assertEqual(
            self.main_contract.quick_read("posts", "me", ["test", "bounty"]), 0
        )
        self.assertRaises(AssertionError, lambda: self.award())

    def test_award_not_owner(self):
        self.change_signer("me")
        self.get_contracts()
        self.post()
        self.assertEqual(
            self.main_contract.quick_read("posts", "me", ["test", "bounty"]), 500
        )
        self.change_signer("notme")
        self.get_contracts()
        self.main_contract.answer(title="test", content="this is an answer", owner="me")
        self.change_signer(self.main_contract.name)
        self.get_contracts()
        self.currency_contract.quick_write("balances", self.main_contract.name, 10000)
        self.currency_contract.approve(amount=1000, to=self.client.signer)
        self.assertRaises(
            AssertionError,
            lambda: self.main_contract.award(title="test", winner="notme"),
        )


if __name__ == "__main__":
    unittest.main()
