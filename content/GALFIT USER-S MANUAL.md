---
title: GALFIT USER-S MANUAL
filename: 
tags: 
categories: 
status: 
share: true
image: 
description: 
created: 2025-03-27T01:17:29+08:00
updated: 2025-04-02T07:47:16+08:00
---


## GALFIT USER\'S MANUAL {#galfit-users-manual-1}

## Comments

### LEAST-SQUARES MINIMIZATION AND STATISTICS
The indicator of goodness:

$$
\begin{equation}
\chi_{\nu}^{2} = \frac{1}{N_{DOF}} \sum_{x=1}^{n_{x}} \sum_{y=1}^{n_{y}} \frac{\pqty{ f_{\text{data}}(x,y) - f_{\text{model}}(x,y)}^{2}}{ {\sigma(x,y)}^{2} }
\end{equation}
$$

#### The Header Keywords
我们需要用表头关键词生成 $\sigma$ image.
There are 4 standard header keywords that GALFIT normally scans for in a FITS images:
-   EXPTIME
-   GAIN (or ATODGAIN)
-   RDNOISE (*Deprecated since Version 3.0.1*)
-   NCOMBINE
### THE RADIAL PROFILE FUNCTIONS
#### The Exponential Disk Profile

The functional form of the exponential profile is: $$ \Sigma(r) = \Sigma_{0} \exp(- \frac{r}{r_{s}}) $$ and total luminosity is: $$ F_{tot} = 2\pi{r_{s}}^{2}\Sigma_{0}q / R(C_{0},m) $$ Because the exponential disk profile is a special case of the Sersic function when $n = 1$, there is a relationshp between $r_{e}$ and $r_{s}$, given by: $$ r_{e} = 1.678 r_{s}$$ 6 free parameters are: $x$, $y$, $\text{mag}_{\text{tot}}$, $r_{s}$, $\theta_{\text{PA}}$, $q$.
#### The Gaussian Profile
The functional form is: $$ \Sigma(r) = \Sigma_{0} \exp(\frac{-r^{2}}{2\sigma^{2}}) $$ and $$ F_{\text{tot}} = 2\pi\sigma^{2}\Sigma_{0}q / R(C_{0},m) $$ here the size parameter is the **FWHW** instead of $r_{e}$ with $\mathrm{FWHW} = 2.345 \sigma$.

#### The Modified Ferrer Profile

The functiona of The Ferrer Profile is 
$$ 
\Sigma(r) = \Sigma_{0} \pqty{1 - (r/r_{0})^{2-\beta}}^{\alpha} 
$$
-   nearly flat core (slope governed by $\beta$)
-   truncation (sharpness is governed by $\alpha$)
-   *Because of the flat core and sharp truncation behavior, it is often used to fit galaxy bars and "lenses."*
#### The Empirical (Modified) King Profile

This profile is often used to fit the light profile of *globular clusters*. 
$$
\Sigma(r) = \Sigma_{0} \bqty{1 - \frac{1}{\pqty{ 1 + (r_{t}/r)^{2}}^{1/\alpha}} }^{-\alpha} \times \bqty{ \frac{1}{ \pqty{1 + (r/r_{c})^{2}}^{1/\alpha}} - \frac{1}{\pqty{1 + (r_{t}/r_{c})^{2}}^{1/\alpha}} }^{\alpha}
$$
### The Moffat Profile
-   The profile of the **HST WFPC2 PSF** is well described by the Moffat function.
### The Nuker Profile
