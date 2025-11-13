package validator

import "strings"

func NonEmpty(s string) bool { return strings.TrimSpace(s) != "" }

