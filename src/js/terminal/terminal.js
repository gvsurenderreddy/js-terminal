(function(global, _) {
    var Terminal = {
        _resolveCommands: function() {
            return Object.keys(this.commands).map(function(key) {
                return Terminal.CommandDecorator.decorate(Terminal.commands[key]);
            });
        },
        start: function() {
            var resolvedCommands = this._resolveCommands();
            this.CommandRepository.register(resolvedCommands);
        },
        commands: {},
        create: function(options) {
            var results = options.results,
                textInput = options.textInput;

            return {
                _addTextToResults: function(text) {
                    results.innerHTML += '<p>' + text + '</p>';
                },
                _clearInput: function() {
                    textInput.value = '';
                },
                _scrollToBottomOfResults: function() {
                    results.scrollTop = results.scrollHeight;
                },
                focus: function() {
                    textInput.focus();
                    this._scrollToBottomOfResults();
                },
                enter: function() {
                    var commandText = textInput.value.trim(),
                        command = Terminal.CommandRepository.findByCommandText(commandText.toLowerCase()),
                        parameter = '',
                        response = '';

                    this._addTextToResults('<p class=\'userEnteredText\'>> ' + _.escape(commandText) + '</p>');

                    if (command) {
                        parameter = commandText.replace(command.name, '').trim();
                        response = command.execute(parameter);
                    }
                    else {
                        response = '<p><i>The command <b>' + _.escape(commandText) + '</b> was not found. Type <b>Help</b> to see all commands.</i></p>';
                    }

                    this._addTextToResults(response);
                    this._clearInput();
                    this._scrollToBottomOfResults();
                }
            };
        }
    };

    global.Terminal = Terminal;
})(window, window.underscore);
