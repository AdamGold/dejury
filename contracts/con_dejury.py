"""
dejury
Ask anything, and get paid to answer.

Summary
----------------
1. Ask a question and set a bounty
2. Answer
3. Asker chose your answer? congras, you get all the TAU.

Contract design
----------------
1. post:
    a. add to list of questions - poster and bounty
    b. add bounty to contract balance
2. answer:
    a. add to list of answers - poster and question ID
3. award: choose the winning answer based on answer ID
    a. check if bounty already given?
    a. send TAU to poster's address
    b. mark bounty given
"""
import currency

posts = Hash(default_value="")
answers = Hash()
balances = ForeignHash(foreign_contract="currency", foreign_name="balances")


@export
def post(title: str, content: str, bounty: int):
    sender = ctx.caller

    assert not posts[sender, title], "There is already an existing post with this title"
    assert content, "A question must not be empty."
    assert (
        balances[sender] > bounty
    ), "You must have enough coins in order to create this post."

    transfer(from_=sender, to=ctx.this, amount=bounty)
    posts[sender, title, "content"] = content
    posts[sender, title, "bounty"] = bounty
    posts[sender, title, "bounty_given"] = False


@export
def answer(title: str, content: str, owner: str):
    sender = ctx.caller

    assert content, "An answer must not be empty."
    assert not answers[
        title, sender
    ], "You have already posted an answer for this question."
    assert posts[owner, title], "This question does not exist."
    answers[title, sender] = content


@export
def award(title: str, winner: str):
    post = posts[ctx.caller, title]
    answer = answers[title, winner]
    assert post, "Post not found."
    assert not post["bounty_given"], "Bounty has already been given for this post."
    assert answer, "This answer does not exist."
    transfer(from_=ctx.this, to=winner, amount=post["bounty"])
    post["bounty_given"] = True


def transfer(from_: str, to: str, amount: int):
    # Transfer currency to caller
    currency.transfer_from(amount, to, from_)
