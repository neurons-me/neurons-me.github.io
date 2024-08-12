# neurons-me.github.io
------
**Overview of the Flow**
​	1.	**Repository Structure:**
​	•	Each of your repositories has a jsdocs branch dedicated to generating documentation.
​	•	The jsdocs.json configuration file is located in ./src/conf/ within your repository.
​	•	The JSDoc template (better-docs) is stored remotely at neurons-me.github.io/src/better-docs.

​	2.	**Outcome:**
​	•	When you push code to the jsdocs branch, GitHub Actions automatically runs the JSDoc command using the configuration in ./src/conf/jsdocs.json.
​	•	The documentation is generated using the better-docs template hosted at neurons-me.github.io.
​	•	The generated documentation is stored in the ./docs directory of your repository.

code.neurons.me
