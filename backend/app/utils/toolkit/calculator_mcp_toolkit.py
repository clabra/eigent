import math
import operator
import re
from typing import Any, List, Union
from camel.toolkits import BaseToolkit, FunctionTool
from app.service.task import Agents
from app.utils.listen.toolkit_listen import listen_toolkit
from app.utils.toolkit.abstract_toolkit import AbstractToolkit


class CalculatorMCPToolkit(BaseToolkit, AbstractToolkit):
    """MCP Calculator Toolkit for performing mathematical calculations"""

    agent_name: str = Agents.developer_agent

    def __init__(self, api_task_id: str, timeout: float | None = None):
        super().__init__(timeout)
        self.api_task_id = api_task_id

        # Define safe operations
        self.safe_operators = {
            '+': operator.add,
            '-': operator.sub,
            '*': operator.mul,
            '/': operator.truediv,
            '//': operator.floordiv,
            '%': operator.mod,
            '**': operator.pow,
            '^': operator.pow,
        }

        # Safe mathematical functions
        self.safe_functions = {
            'abs': abs,
            'round': round,
            'min': min,
            'max': max,
            'sum': sum,
            'sqrt': math.sqrt,
            'sin': math.sin,
            'cos': math.cos,
            'tan': math.tan,
            'log': math.log,
            'log10': math.log10,
            'exp': math.exp,
            'ceil': math.ceil,
            'floor': math.floor,
            'pi': lambda: math.pi,
            'e': lambda: math.e,
        }

    @listen_toolkit(
        inputs=lambda _, expression: f"expression: {expression}",
        return_msg=lambda res: f"Result: {res}",
    )
    def calculate(self, expression: str) -> Union[float, int, str]:
        """Perform mathematical calculations safely.

        Args:
            expression (str): Mathematical expression to evaluate (e.g., "2 + 3 * 4", "sqrt(16)", "sin(pi/2)")

        Returns:
            Union[float, int, str]: The calculated result or error message
        """
        try:
            # Clean and validate the expression
            expression = expression.strip()
            if not expression:
                return "Error: Empty expression"

            # Replace common mathematical constants
            expression = expression.replace('pi', str(math.pi))
            expression = expression.replace('e', str(math.e))

            # Replace ^ with ** for exponentiation
            expression = expression.replace('^', '**')

            # Check for potentially dangerous patterns
            dangerous_patterns = [
                '__', 'import', 'exec', 'eval', 'open', 'file', 'input', 'raw_input',
                'compile', 'globals', 'locals', 'vars', 'dir', 'getattr', 'setattr',
                'delattr', 'hasattr', 'callable', 'isinstance', 'issubclass'
            ]

            for pattern in dangerous_patterns:
                if pattern in expression.lower():
                    return f"Error: Potentially unsafe operation detected: {pattern}"

            # For simple arithmetic expressions, use eval with restricted environment
            if self._is_simple_arithmetic(expression):
                # Create a safe namespace
                safe_dict = {
                    "__builtins__": {},
                    **self.safe_functions
                }

                try:
                    result = eval(expression, safe_dict)

                    # Handle special cases
                    if isinstance(result, complex):
                        if result.imag == 0:
                            result = result.real
                        else:
                            return f"{result.real} + {result.imag}i"

                    # Round very small numbers to avoid floating point errors
                    if isinstance(result, float) and abs(result) < 1e-15:
                        result = 0.0

                    # Format the result nicely
                    if isinstance(result, float):
                        if result.is_integer():
                            return int(result)
                        else:
                            # Round to reasonable precision
                            return round(result, 10)

                    return result

                except ZeroDivisionError:
                    return "Error: Division by zero"
                except OverflowError:
                    return "Error: Number too large"
                except ValueError as e:
                    return f"Error: Invalid value - {str(e)}"
                except Exception as e:
                    return f"Error: {str(e)}"
            else:
                return "Error: Expression too complex or contains unsupported operations"

        except Exception as e:
            return f"Error: Failed to process expression - {str(e)}"

    def _is_simple_arithmetic(self, expression: str) -> bool:
        """Check if expression contains only safe mathematical operations"""
        # Allow numbers, operators, parentheses, and safe function names
        allowed_pattern = r'^[0-9+\-*/().%^\s]+$|^[0-9+\-*/().%^\s\w]*(' + '|'.join(self.safe_functions.keys()) + r')[0-9+\-*/().%^\s\w]*$'

        # More comprehensive check
        safe_chars = set('0123456789+-*/().%^ \t\n')
        safe_words = set(self.safe_functions.keys())

        # Remove all safe words and check if remaining characters are safe
        temp_expr = expression.lower()
        for word in safe_words:
            temp_expr = temp_expr.replace(word, '')

        return all(c in safe_chars for c in temp_expr)

    @listen_toolkit(
        inputs=lambda _, *numbers: f"numbers: {numbers}",
        return_msg=lambda res: f"Sum: {res}",
    )
    def add(self, *numbers: float) -> float:
        """Add multiple numbers together.

        Args:
            *numbers: Variable number of numeric arguments

        Returns:
            float: Sum of all numbers
        """
        try:
            return sum(float(n) for n in numbers)
        except (ValueError, TypeError) as e:
            return f"Error: Invalid number format - {str(e)}"

    @listen_toolkit(
        inputs=lambda _, a, b: f"a: {a}, b: {b}",
        return_msg=lambda res: f"Result: {res}",
    )
    def subtract(self, a: float, b: float) -> float:
        """Subtract two numbers (a - b).

        Args:
            a (float): First number
            b (float): Second number

        Returns:
            float: Result of a - b
        """
        try:
            return float(a) - float(b)
        except (ValueError, TypeError) as e:
            return f"Error: Invalid number format - {str(e)}"

    @listen_toolkit(
        inputs=lambda _, *numbers: f"numbers: {numbers}",
        return_msg=lambda res: f"Product: {res}",
    )
    def multiply(self, *numbers: float) -> float:
        """Multiply multiple numbers together.

        Args:
            *numbers: Variable number of numeric arguments

        Returns:
            float: Product of all numbers
        """
        try:
            result = 1
            for n in numbers:
                result *= float(n)
            return result
        except (ValueError, TypeError) as e:
            return f"Error: Invalid number format - {str(e)}"

    @listen_toolkit(
        inputs=lambda _, a, b: f"a: {a}, b: {b}",
        return_msg=lambda res: f"Result: {res}",
    )
    def divide(self, a: float, b: float) -> Union[float, str]:
        """Divide two numbers (a / b).

        Args:
            a (float): Dividend
            b (float): Divisor

        Returns:
            Union[float, str]: Result of a / b or error message
        """
        try:
            a_float = float(a)
            b_float = float(b)
            if b_float == 0:
                return "Error: Division by zero"
            return a_float / b_float
        except (ValueError, TypeError) as e:
            return f"Error: Invalid number format - {str(e)}"

    @listen_toolkit(
        inputs=lambda _, base, exponent: f"base: {base}, exponent: {exponent}",
        return_msg=lambda res: f"Result: {res}",
    )
    def power(self, base: float, exponent: float) -> Union[float, str]:
        """Raise a number to a power (base ^ exponent).

        Args:
            base (float): Base number
            exponent (float): Exponent

        Returns:
            Union[float, str]: Result of base ^ exponent or error message
        """
        try:
            base_float = float(base)
            exp_float = float(exponent)
            result = base_float ** exp_float

            if math.isinf(result):
                return "Error: Result is infinite"
            if math.isnan(result):
                return "Error: Result is not a number"

            return result
        except (ValueError, TypeError) as e:
            return f"Error: Invalid number format - {str(e)}"
        except OverflowError:
            return "Error: Number too large"

    @listen_toolkit(
        inputs=lambda _, number: f"number: {number}",
        return_msg=lambda res: f"Square root: {res}",
    )
    def square_root(self, number: float) -> Union[float, str]:
        """Calculate the square root of a number.

        Args:
            number (float): Number to find square root of

        Returns:
            Union[float, str]: Square root or error message
        """
        try:
            num_float = float(number)
            if num_float < 0:
                return "Error: Cannot calculate square root of negative number"
            return math.sqrt(num_float)
        except (ValueError, TypeError) as e:
            return f"Error: Invalid number format - {str(e)}"

    def get_tools(self) -> List[FunctionTool]:
        """Get all available calculator tools"""
        return [
            FunctionTool(self.calculate),
            FunctionTool(self.add),
            FunctionTool(self.subtract),
            FunctionTool(self.multiply),
            FunctionTool(self.divide),
            FunctionTool(self.power),
            FunctionTool(self.square_root),
        ]