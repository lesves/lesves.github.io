+++
title = "The Ski Rental Problem"
slug = "ski-rental"
date = "2025-06-01"
template = "article.html"

[extra]
lang = "en"
+++

# Ski Rental Problem

The ski rental problem is a classic example problem in online algorithms. It feels like a small but interesting problem that can be explained relatively easily while some clever tricks can be applied to it.

In this article, I took [these lecture notes](https://courses.cs.duke.edu/fall13/compsci530/notes/lec23.pdf) by Debmalya Panigrahi and Hangjie Ji and tried to rewrite them in a way that is easier to understand (at least for me).

## Formulation
You are going skiing in the mountains but you are unsure about the weather reports and don't know how many days you will want to ski (and it can be any number of days).
Renting skis costs $1$ unit of currency while buying them costs $B$ units of currency.
The question is whether you should buy skis and on which day.

## Optimal offline algorithm
Assuming you wound know the number $k$ of days you will want to ski in advance, an optimal algorithm can be derived.
If $k \geq B$, you should buy the skis and if $k < B$, you should only rent them.
So you will pay $\min\\{k, B\\}$.

We will need this later, so let's call it $\text{opt}(k) = \min\\{k, B\\}$.

## Simple online algorithm
But what about if you don't know $k$?

A simple algorithm is to buy the skis when you paid $B$ for renting them.
So, the cost is $$\text{alg}(k) = \begin{cases}k & \text{if }k\leq B\\\\ B+B & \text{if }k>B\end{cases}.$$

We will study the competitive ratio $\rho$ defined as the worst-case ratio of a given online algorithm and the optimal offline algorithm.
$$
\rho_\text{simple} = \max_k \frac{\text{alg(k)}}{\text{opt}(k)} = \max_k \begin{Bmatrix}\frac{k}{k} & \text{if }k \leq B\\\\ \frac{B+B}{B} & \text{if }k > B\end{Bmatrix} = \max_k \begin{Bmatrix}1 & \text{if }k \leq B\\\\ 2 & \text{if }k > B\end{Bmatrix} = 2
$$
So, the simple online algorithm is at most two times worse than the offline "future knowing" algorithm.

## The randomized algorithm
Let's try to find a better performing randomized algorithm. In fact, an algorithm with $\mathbb{E}[\rho]\approx\frac{e}{e-1}$ exists. This could be useful for example if we do many such decisions and want to do well on average.

In this algorithm, we will buy skis on the $(i+1)$-th day with probability $P_i$. These probabilities should satisfy $\sum_{i=0}^\infty P_i = 1$. We will also assume that the ski buying events are independent.

So when we buy the skis on day $i+1$, we pay $i+B$ if $i < k$ and $k$ if $i \geq k$, thus the expected cost is:
$$
\mathbb{E}\left[\text{alg}(k)\right] = k\sum_{i\geq k}P_i + \sum_{i<k}(i+B)P_i
$$

We will approximate this with a continuous probability distribution with probability density $P(x)$:
$$
\mathbb{E}\left[\text{alg}(k)\right] \approx k\int_k^\infty P(x)\mathrm{d}x + \int_0^k (x+B)P(x)\mathrm{d}x
$$
Thus, we have switched from a discrete algorithm to a continuous one, so it will tell us the exact time when to buy instead of some day. With it we will approximate the discrete solution (which also exists but is more complicated to analyze).

Now, we would like to find the optimal probability distribution $P(x)$ such that the competitive ratio $\rho$ is the lowest. We will use an insight which we won't prove. The insight is that the optimal choice is such a distribution $P(x)$ that $\alpha = \frac{\mathbb{E}\left[\text{alg}(k)\right]}{\text{opt}(k)}$ does not depend on $k$. Thus, $\mathbb{E}\left[\rho\right] = \max_k\frac{\mathbb{E}\left[\text{alg}(k)\right]}{\text{opt}(k)} = \max_k\alpha = \alpha$.

So, we have
$$
\begin{aligned}
\frac{\mathbb{E}\left[\text{alg}(k)\right]}{\text{opt}(k)} &= \alpha \\\\
k\int_k^\infty P(x)\mathrm{d}x + \int_0^k (x+B)P(x)\mathrm{d}x &= \alpha\min\\{k, B\\}
\end{aligned}
$$

And we have two cases,

### I) When $k \geq B$
We differentiate both sides with respect to $k$:
$$
\begin{aligned}
\global\def\der{\frac{\mathrm{d}}{\mathrm{d}k}}
\global\def\Der#1{\frac{\mathrm{d}#1}{\mathrm{d}k}}
k\int_k^\infty P(x)\mathrm{d}x + \int_0^k (x+B)P(x)\mathrm{d}x &= \alpha B \\\\
\der\left(k\int_k^\infty P(x)\mathrm{d}x + \int_0^k (x+B)P(x)\mathrm{d}x\right) &= \Der{\alpha B} \\\\
\Der{k}\int_k^\infty P(x)\mathrm{d}x + k\der\left(\int_k^\infty P(x)\mathrm{d}x\right) + \der\left(\int_0^k (x+B)P(x)\mathrm{d}x\right) &= 0 \\\\
\int_k^\infty P(x)\mathrm{d}x - kP(k) + (k+B)P(k) &= 0 \\\\
\int_k^\infty P(x)\mathrm{d}x + BP(k) &= 0
\end{aligned}
$$
Because $P(x) \geq 0$, the integral is nonnegative. And because $B > 0$, the integral must be zero and $P(k) = 0$ in order to satisfy the equation.

### II) When $k < B$
We proceed in a similar fashion:
$$
\begin{aligned}
k\int_k^\infty P(x)\mathrm{d}x + \int_0^k (x+B)P(x)\mathrm{d}x &= \alpha k \\\\
\int_k^\infty P(x)\mathrm{d}x + BP(k) &= \alpha
\end{aligned}
$$
However, now we take the derivative once more:
$$
\begin{aligned}
\der\int_k^\infty P(x)\mathrm{d}x + \der BP(k) &= \Der{\alpha} \\\\
B\Der{P(k)} - P(k) &= 0
\end{aligned}
$$

This is a differential equation, which can be solved as $P(k) = Ae^\frac{k}{B}$, where $A$ is some constant.

We have the constraint that $\int_0^\infty P(x)\mathrm{d}x = 1$, so if we combine both cases, we get:
$$
\begin{aligned}
\int_0^\infty P(x)\mathrm{d}x = \int_0^B Ae^\frac{k}{B}\mathrm{d}k &= 1 \\\\
\left[ABe^\frac{k}{B}\right]_0^B &= 1 \\\\
ABe - AB &= 1 \\\\
AB(e - 1) &= 1 \\\\
A &= \frac{1}{B(e-1)}
\end{aligned}
$$

So, the probability distribution is
$$
P(x) = \begin{cases}
\frac{1}{B(e-1)}e^\frac{x}{B} & \text{if }x < B \\\\
0 & \text{else}
\end{cases}
.
$$

Finally, we calculate the expected competitive ratio:
$$
\mathbb{E}\left[\rho_\text{rand}\right] = \max_k \frac{\mathbb{E}\left[\text{alg}(k)\right]}{\text{opt}(k)} = \alpha
$$
And since $\alpha$ is same for all $k$, we have
$$
\mathbb{E}\left[\rho_\text{rand}\right] \approx \frac{\frac{e^\frac{B}{B}}{B(e-1)}}{B} = \frac{e}{e-1}
$$

## Applications
This is probably not applicable in reality, however when one would do many decisions similar to this fictional scenario, the randomized algorithm could theoretically be a way to optimize the cost.

## Code
I also coded it in Python just to play around. But be wary that in this code we are again solving the discrete problem by just approximating using the equivalent continuous problem.

```python
from scipy.stats import rv_discrete
from scipy.integrate import quad
import numpy as np


def pdf(x, B):
    if 0 <= x < B:
        return np.exp(x/B)/B/(np.e-1)
    return 0


@np.vectorize
def day_prob(k, B):
    return quad(pdf, k, k+1, args=(B,))[0]


cost = float(input("Enter buy price of the item: "))
rental_cost = float(input("Enter rental price of the item per day: "))
B_f = cost/rental_cost
B = int(np.ceil(B_f))

disc_prob = day_prob(np.arange(B), B_f)
dist = rv_discrete(values=(range(B), disc_prob))

print(f"You should buy at day {dist.rvs(1)+1} (one based indexing).")
```
