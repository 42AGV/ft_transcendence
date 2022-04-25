# ft_transcendence
🏓 Play pong online with your friends in real time

# 🤝 Contributing

If you want to contribute to this project you may follow a set of rules.

### 1. Create a new issue or task:

- With every contribution there must be a related issue/task, so if you
don't have any, create a new one on the project board with some
detailed info about what do you want to accomplish.
- Add an appropiate label which describes issue type: `feature`, `bug`,
`task` etc.

### 2. Create a new branch:
   
- ⚠️ We **do not** push to `main`, never. So you'll need to create a branch
to work on it.
- Try to start always from `main` and do not forget to bring
all new changes, preferably with `git pull --rebase` so you don't corrupt
commit history.

### 3. Naming:

- What about branch naming? A good standard way to name could be issue
+ brief description of the task. For example:
`#11/add-contributing-docs`
- We also try to have a **normalized way to name commits**. Because is complicated
to always have great commit messages (despite you should) a good enough 
naming strategy is adding your issue number followd by the message. This way other devs can
keep track of some context of the changes just visiting the related issue
because GitHub will link to it. Try something like:
`#11 / add main contributing points`

### 4. Pull Requests:
    
- When you are ready, you can create a new PR pointing to main. We have defined
two requisites to be able to merge your branch into main:
    - At least **two reviewers approved your changes**
    - You also have **passed all CI checks** (tests, linting etc.)
- In the PR description you should add: `closing #11` (number of related issue) so
when PR gets integrated, issue gets closed automatically
- As with the commits, the ideal is to name it with the issue number followed by a general
description of what is about: `#11 / add contributing documentation`
- Once you pass all these checks, **you are responsible to integrate your changes**.
We have actually two ways: manually or automatically with 
[auto-merge](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/automatically-merging-a-pull-request)
- We've decided to integrate our branches using a `squash` strategy. This let
us to have some freedom when working in our branches. The only requisite is following
`issue_number + short descriptive message` rule in the squash message.
### 5. Conflicts:

- How do I solve conflicts? Most likely, someone merged some commits into `main`
that affect the same files and lines as yours. One of the **cleanest** ways to solve
this is just to update (pull) main in your local and, then, rebase main into
your branch: `git rebase main`. Git will make you solve conflicts one by one,
you just have to follow the instructions!
