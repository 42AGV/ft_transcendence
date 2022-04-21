# ft_transcendence
🏓 Play pong online with your friends in real time

# 🤝 Contributing

If you want to contribute to this project you may follow a set of rules.

### 1. Create a new issue or task:

- With every contribution there must be a related issue/task, so if you
don't have any, create a new one on the project board with some
detailed info about what do you want to accomplish.

### 2. Create a new branch:
   
- ⚠️ We **do not** push to `master`, never. So you'll need to create a branch
to work on it.
- Try to start always from `master` and do not forget to bring
all new changes, preferably with `git pull --rebase` so you don't corrupt
commit history.

### 3. Naming:

- What about branch naming? A good standard way to name could be your
GH userName + brief description of the task. For example:
`marvin/add-contributing-docs`
- We also try to have a **normalized way to name commits**. Because is complicated
to always have great commit messages (despite you should) a good enough 
naming strategy is adding your issue number followd by the message. This way other devs can
keep track of some context of the changes just visiting the related issue
because GitHub will link to it. Try something like:
`#11 / add main contributing points`

### 4. Pull Requests:
    
- When you are ready, you can create a new PR pointing to master. We have defined
two requisites to be able to merge your branch into master:
    - At least **two reviewers approved your changes**
    - You also have **passed all CI checks** (tests, linting etc.)
- As with the commits, the ideal is to name it with the issue number followed by a general
description of what is about: `#11 / add contributing documentation`
- Once you pass all these checks, **you are responsible to integrate your changes**.
We have actually two ways: manually (always with a `merge commit` strategy) or setting
[auto-merge](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/automatically-merging-a-pull-request)

### 5. Conflicts:

- How do I solve conflicts? Most likely, someone merged some commits into `master`
that affect the same files and lines as yours. One of the **cleanest** ways to solve
this is just to update (pull) master in your local and, then, rebase master into
your branch: `git rebase master`. Git will make you solve conflicts one by one,
you just have to follow the instructions!
