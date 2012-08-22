module Jasmine::Headless
  class HamlcTemplate < HamlCoffeeAssets::Tilt::TemplateHandler
    
    self.default_mime_type = 'application/javascript'

    def prepare ; end

    def evaluate(scope, locals, &block)
      %{<script type="text/javascript">#{super}</script>}
    end
  end
end

